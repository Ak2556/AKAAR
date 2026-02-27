from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, List
from ..core.database import get_db
from ..models.schemas import ProductResponse, ProductListResponse, CategoryResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    pageSize: int = Query(12, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    inStock: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * pageSize

    # Build query
    where_clauses = []
    params = {"limit": pageSize, "offset": offset}

    if category:
        where_clauses.append("c.slug = :category")
        params["category"] = category

    if search:
        where_clauses.append("(p.name ILIKE :search OR p.description ILIKE :search)")
        params["search"] = f"%{search}%"

    if minPrice is not None:
        where_clauses.append("p.price >= :minPrice")
        params["minPrice"] = minPrice

    if maxPrice is not None:
        where_clauses.append("p.price <= :maxPrice")
        params["maxPrice"] = maxPrice

    if inStock is not None:
        where_clauses.append("p.\"inStock\" = :inStock")
        params["inStock"] = inStock

    where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"

    # Get products
    result = db.execute(
        text(f"""
            SELECT p.id, p.name, p.slug, p.description, p.price,
                   p.images, p."modelUrl", p."inStock", p."categoryId", p."createdAt"
            FROM "Product" p
            LEFT JOIN "Category" c ON p."categoryId" = c.id
            WHERE {where_sql}
            ORDER BY p."createdAt" DESC
            LIMIT :limit OFFSET :offset
        """),
        params
    )
    products = result.fetchall()

    # Get total count
    count_result = db.execute(
        text(f"""
            SELECT COUNT(*) as total
            FROM "Product" p
            LEFT JOIN "Category" c ON p."categoryId" = c.id
            WHERE {where_sql}
        """),
        params
    )
    total = count_result.fetchone().total

    return ProductListResponse(
        products=[
            ProductResponse(
                id=str(p.id),
                name=p.name,
                slug=p.slug,
                description=p.description,
                price=float(p.price),
                images=p.images or [],
                modelUrl=p.modelUrl,
                inStock=p.inStock,
                categoryId=str(p.categoryId),
                createdAt=p.createdAt
            )
            for p in products
        ],
        total=total,
        page=page,
        pageSize=pageSize
    )


@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT id, name, slug, description FROM \"Category\" ORDER BY name")
    )
    categories = result.fetchall()

    return [
        CategoryResponse(
            id=str(c.id),
            name=c.name,
            slug=c.slug,
            description=c.description
        )
        for c in categories
    ]


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT id, name, slug, description, price, images,
                   "modelUrl", "inStock", "categoryId", "createdAt"
            FROM "Product" WHERE slug = :slug
        """),
        {"slug": slug}
    )
    product = result.fetchone()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductResponse(
        id=str(product.id),
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=float(product.price),
        images=product.images or [],
        modelUrl=product.modelUrl,
        inStock=product.inStock,
        categoryId=str(product.categoryId),
        createdAt=product.createdAt
    )
