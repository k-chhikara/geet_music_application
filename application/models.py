from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import datetime
import pytz

# Create a timezone object for Indian Standard Time (IST)
indian_tz = pytz.timezone('Asia/Kolkata')



db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50),unique=False,nullable=True)
    email = db.Column(db.String, unique=True)
    gender=db.Column(db.String(20),unique=False ,nullable=True)
    password = db.Column(db.String(255))
    contact=db.Column(db.String(15), unique=False,nullable=True)
    doj=db.Column(db.DateTime, default=datetime.now().astimezone(indian_tz))
    lastlogin=db.Column(db.DateTime,nullable=True)
    
    active = db.Column(db.Boolean())
    flagged=db.Column(db.Boolean(),nullable=False, unique=False,default=0) 

    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class StudyResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    # creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resource_link = db.Column(db.String, nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50),unique=False, nullable=False)
    author = db.Column(db.String(50),unique=False, nullable=False)
    published = db.Column(db.DateTime,unique=False,nullable=False,default=datetime.utcnow)

    albumcover=db.Column(db.String(150), nullable=False, default="default.jpg")    
    
    tracks= db.relationship('Track', backref="album",cascade="all, delete")  # fake column name album that is going to be added on track (imaginary column just for reference)
    
    owner=db.Column(db.Integer,db.ForeignKey('user.id')) #refered by the username of the person who uploads
    likes=db.Column(db.Integer, default=0)
    def __repr__(self):
        return '<Album %r>' % self.title  

class Track(db.Model):
    __searchable__=['name','singer','music','lyricist','lyrics','owner']
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50),unique=False)
    singer = db.Column(db.String(50),unique=False,default='NA')
    music = db.Column(db.String(50),unique=False,default='NA')
    lyricist = db.Column(db.String(50),unique=False,default='NA')
    published = db.Column(db.DateTime,unique=False,default=datetime.utcnow)
    lyrics = db.Column(db.Text , default="Not Available")

    trackimage=db.Column(db.String(150), nullable=False, default="default.jpg")
    mp3file=db.Column(db.String(150), nullable=False)

    album_id=db.Column(db.Integer, db.ForeignKey('album.id'))

    owner=db.Column(db.Integer,db.ForeignKey('user.id')) #refered by the username of the person who uploads

    likes=db.Column(db.Integer, default=0)
    def __repr__(self):
        return '<Track %r>' % self.name  



playlist_tracks=db.Table('playlist_tracks',
                         db.Column('song_id',db.Integer,db.ForeignKey('playlistsongs.id')),
                         db.Column('userplaylist_id',db.Integer,db.ForeignKey('userplaylist.id'))
                         )

class Userplaylist(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50),unique=False,nullable=True)
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'))
    songs=db.relationship('Playlistsongs',secondary=playlist_tracks,backref="playlist",cascade="all, delete")
    def __repr__(self):
        return '<playlist %r>' % self.name


class Playlistsongs(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    
    
    def __repr__(self):
        return '<song id: %r>' % self.id
