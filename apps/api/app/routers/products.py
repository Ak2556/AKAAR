from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, List
from ..core.database import get_db
from ..models.schemas import ProductResponse, ProductListResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    pageSize: int = Query(12, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    isActive: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * pageSize

    # Build query
    where_clauses = []
    params = {"limit": pageSize, "offset": offset}

    if category:
        where_clauses.append("p.category = :category")
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

    if isActive is not None:
        where_clauses.append("p.\"isActive\" = :isActive")
        params["isActive"] = isActive

    where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"

    # Get products
    result = db.execute(
        text(f"""
            SELECT p.id, p.name, p.slug, p.description, p."shortDescription", p.price,
                   p."imageUrl", p.category, p."sortOrder", p."isActive", p."meshFileId", p."createdAt", p."updatedAt"
            FROM "Product" p
            WHERE {where_sql}
            ORDER BY p."sortOrder" ASC, p."createdAt" DESC
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
                shortDescription=p.shortDescription,
                price=float(p.price) if p.price else None,
                imageUrl=p.imageUrl,
                category=p.category,
                sortOrder=p.sortOrder,
                isActive=p.isActive,
                meshFileId=p.meshFileId,
                createdAt=p.createdAt,
                updatedAt=p.updatedAt
            )
            for p in products
        ],
        total=total,
        page=page,
        pageSize=pageSize
    )


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT id, name, slug, description, "shortDescription", price, "imageUrl", 
                   category, "sortOrder", "isActive", "meshFileId", "createdAt", "updatedAt"
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
        shortDescription=product.shortDescription,
        price=float(product.price) if product.price else None,
        imageUrl=product.imageUrl,
        category=product.category,
        sortOrder=product.sortOrder,
        isActive=product.isActive,
        meshFileId=product.meshFileId,
        createdAt=product.createdAt,
        updatedAt=product.updatedAt
    )
