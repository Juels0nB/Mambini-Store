from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, UserLogin, Token
from app.auth import create_access_token, get_current_user

router = APIRouter(prefix="/users")

@router.post("/register", response_model=UserOut)
def register(user: UserCreate):
    if User.objects(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    
    role_to_set = getattr(user, "role", "client")  

    db_user = User(
        email=user.email,
        name=user.name,
        role=role_to_set
    )
    db_user.set_password(user.password)
    db_user.save()
    
    return UserOut(email=db_user.email, name=db_user.name, role=db_user.role)

@router.post("/login", response_model=Token)
def login(user: UserLogin):  
    db_user = User.objects(email=user.email).first()
    if not db_user or not db_user.verify_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"user_id": str(db_user.id), "role": db_user.role})
    return Token(access_token=token)

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Devolve o utilizador logado com base no token JWT"""
    return UserOut(
        email=current_user.email,
        name=current_user.name,
        role=current_user.role
    )