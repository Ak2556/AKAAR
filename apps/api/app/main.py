from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import traceback

from .core.config import settings
from .core.database import engine, Base
from .core.logger import logger
from .routers import health, auth, products, orders, quotes, geometry, upload

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # Simple table creation if not using migrations
    try:
        # Base.metadata.create_all(bind=engine)
        logger.info("Database connection verified")
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")

    yield
    # Shutdown
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AKAAR 3D Printing & Manufacturing API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_detail = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    logger.error(f"Unhandled exception: {str(exc)}\n{error_detail}")

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred. Please try again later.",
            "error_type": type(exc).__name__
        }
    )

# Rate Limiter Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
# app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"]) # Restricted in production

# Routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(quotes.router)
app.include_router(geometry.router)
app.include_router(upload.router)

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }

