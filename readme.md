# *GEET Music Player 🎵*

A full-stack music streaming web application that enables users to explore music, create playlists, and allows creators to upload and manage their own content.

---

## *📌 Project Overview*

GEET Music Player is a role-based platform designed for *Users, Creators, and Admins*, supporting music streaming, content management, and analytics.

* Users can browse songs, create playlists, and explore albums
* Creators can upload and manage their own music
* Admins can monitor platform activity and manage content

The system integrates backend services, database management, and frontend interaction to provide a complete music streaming experience 

---

## *⚙️ Tech Stack*

*Backend*

* Flask
* Flask-SQLAlchemy
* Flask-Security

*Frontend*

* Vue.js (CDN)
* HTML, CSS
* Chart.js

*Asynchronous Processing*

* Celery
* Redis

---

## *🚀 Features*

### *Admin*

* Secure admin login system
* Dashboard for monitoring:

  * Total users and creators
  * Song performance statistics
* Add / update / delete songs
* Automated:

  * Email reports to creators
  * Daily reminders to users

---

### *User*

* User authentication system
* Browse songs and albums
* View lyrics
* Create and manage playlists
* Search songs/albums (by name, artist, etc.)
* Flag songs and albums
* Option to register as a creator

---

### *Creator*

* Separate creator login
* All user functionalities
* Upload, update, and delete songs
* Dashboard for tracking song performance

---

## *🗄️ Database Schema*

### *User*

* id, name, gender, email, password, contact
* flagged, active status
* last login, date of joining

### *Role*

* id, role, description

### *Album*

* id, title, author, published
* album cover, owner

### *Track*

* id, name, singer, music, lyricist
* lyrics, published, owner
* likes, mp3 file, track image

### *UserPlaylist*

* id, name, user_id, song

---

## *📊 Key Functionalities*

* Role-based access control (*Admin / User / Creator*)
* Music content management system
* Playlist creation and personalization
* Search and filtering capabilities
* Analytics dashboards using Chart.js
* Background task handling with Celery + Redis

---

## *🎥 Demo*

[Project Demo Video](https://drive.google.com/file/d/1BP-A4j2xFttSKZ93aY1awhmxcKTsuZ96/view?usp=sharing)