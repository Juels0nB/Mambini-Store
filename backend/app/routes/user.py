from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from typing import List
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut, UserLogin, Token
from app.auth import create_access_token, get_current_user, require_admin

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
    
    return UserOut(id=str(db_user.id), email=db_user.email, name=db_user.name, role=db_user.role)

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
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        role=current_user.role
    )

@router.get("", response_model=List[UserOut])
def get_all_users(admin_user: User = Depends(require_admin)):
    """Lista todos os utilizadores (apenas admin)"""
    users = User.objects.all()
    return [UserOut(id=str(user.id), email=user.email, name=user.name, role=user.role) for user in users]

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: str, user_update: UserUpdate, admin_user: User = Depends(require_admin)):
    """Atualiza um utilizador (apenas admin)"""
    db_user = User.objects(id=user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verificar se o email já existe em outro usuário
    if user_update.email != db_user.email:
        existing_user = User.objects(email=user_update.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user.email = user_update.email
    db_user.name = user_update.name
    if user_update.role:
        db_user.role = user_update.role
    if user_update.password:
        db_user.set_password(user_update.password)
    db_user.save()
    
    return UserOut(id=str(db_user.id), email=db_user.email, name=db_user.name, role=db_user.role)

@router.delete("/{user_id}")
def delete_user(user_id: str, admin_user: User = Depends(require_admin)):
    """Remove um utilizador (apenas admin)"""
    db_user = User.objects(id=user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Não permitir que o admin delete a si mesmo
    if str(db_user.id) == str(admin_user.id):
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db_user.delete()
    return {"message": "User deleted successfully"}