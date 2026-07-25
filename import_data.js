const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/user');
const Gallery = require('./models/gallery');
const Image = require('./models/image');

const mongoDB = "mongodb://localhost:27017/GalleryDB";

function cleanMongoJSON(data) {
  return data.map(doc => {
    const cleanDoc = { ...doc };
    
    if (cleanDoc._id && cleanDoc._id.$oid) {
      cleanDoc._id = cleanDoc._id.$oid;
    }
    
    if (cleanDoc.date && cleanDoc.date.$date) {
      cleanDoc.date = new Date(cleanDoc.date.$date);
    }
    
    if (cleanDoc.user && cleanDoc.user.$oid) {
      cleanDoc.user = cleanDoc.user.$oid;
    }
    if (cleanDoc.gallery && cleanDoc.gallery.$oid) {
      cleanDoc.gallery = cleanDoc.gallery.$oid;
    }
    
    delete cleanDoc.__v;
    
    return cleanDoc;
  });
}

async function importData() {
  try {
    console.log("Laczenie z MongoDB...");
    await mongoose.connect(mongoDB);
    console.log("Polaczono!");

    console.log("Wczytywanie plikow...");
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'example_import', 'GalleryDB.users.json'), 'utf8'));
    const galleriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'example_import', 'GalleryDB.galleries.json'), 'utf8'));
    const imagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'example_import', 'GalleryDB.images.json'), 'utf8'));

    const cleanedUsers = cleanMongoJSON(usersData);
    const cleanedGalleries = cleanMongoJSON(galleriesData);
    const cleanedImages = cleanMongoJSON(imagesData);

    console.log("Czyszczenie istniejacych kolekcji...");
    await User.deleteMany({});
    await Gallery.deleteMany({});
    await Image.deleteMany({});

    console.log("Importowanie nowych danych...");
    await User.insertMany(cleanedUsers);
    console.log(`- Zaimportowano ${cleanedUsers.length} uzytkownikow`);
    
    await Gallery.insertMany(cleanedGalleries);
    console.log(`- Zaimportowano ${cleanedGalleries.length} galerii`);
    
    await Image.insertMany(cleanedImages);
    console.log(`- Zaimportowano ${cleanedImages.length} obrazkow`);

    console.log("Zakonczono pomyslnie! Mozna uruchamiac serwer WWW.");
  } catch (err) {
    console.error("Wystapil blad:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

importData();
