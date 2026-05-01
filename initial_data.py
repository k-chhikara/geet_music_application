from main import app
from application.sec import datastore
from application.models import db, Role, Userplaylist,User
from flask_security import hash_password
from werkzeug.security import generate_password_hash



with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="user", description="User is an general user")
    datastore.find_or_create_role(name="creator", description="User is a creator")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(name="admin",gender="male",contact="1234",email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])
        db.session.commit()
        user=datastore.find_user(email="admin@email.com")
        likedplaylist=Userplaylist(name="liked Songs",user_id=user.id)
        db.session.add(likedplaylist)
        
    if not datastore.find_user(email="creator@email.com"):
        datastore.create_user(name="creator1",gender="male",contact="1234",email="creator1@email.com", password=generate_password_hash("creator"), roles=["creator"], active=False)
        db.session.commit()
        user=datastore.find_user(email="creator1@email.com")
        likedplaylist=Userplaylist(name="liked Songs",user_id=user.id)
        db.session.add(likedplaylist)
    if not datastore.find_user(email="user1@email.com"):
        datastore.create_user(name="user1",gender="male",contact="1234",email="user1@email.com", password=generate_password_hash("user"), roles=["user"])
        db.session.commit()
        user=datastore.find_user(email="user1@email.com")
        likedplaylist=Userplaylist(name="liked Songs",user_id=user.id)
        db.session.add(likedplaylist)

    if not datastore.find_user(email="user2@email.com"):
        datastore.create_user(name="user2",gender="male",contact="1234",email="user2@email.com", password=generate_password_hash("user"), roles=["user"])
        db.session.commit()
        user=datastore.find_user(email="user2@email.com")
        likedplaylist=Userplaylist(name="liked Songs",user_id=user.id)
        db.session.add(likedplaylist)


    db.session.commit()