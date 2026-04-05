from cuid2 import cuid_wrapper

# Create a CUID generator
# Prisma typically uses CUID (v1) or CUID2.
# We'll use CUID2 for modern standards.
cuid_gen = cuid_wrapper()

def generate_cuid() -> str:
    return cuid_gen()
