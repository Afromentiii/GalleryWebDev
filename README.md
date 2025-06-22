# Dokumentacja projektu
## Wymagania
1. Node.js
2. MongoDB
3. (Opcjonalne) MongoDB Compass
## 🟥 Ważne informacje!
1. Aplikacja posiada wbudowane konto admin z hasłem admin.
## ⚙️ Instrukcja uruchomienia
1. Uruchomić server.js znajdujący się w katalogu www za pomocą polecenia node
## ⚙️ Instrukcja importu (MongoDB Compass)
1. Pobrać przykładowe dane np. z folderu example_import z repozytorium
2. W MongoDB Compass stworzyć następujące połączenie: mongodb://localhost:27017/GalleryDB
3. Usunąć rekord z adminem w kolekcji users, ponieważ przykład zawiera admina.
4. Wejść w GalleryDB i dla każdej znajdującej się tam kolekcji -> nacisnąć przycisk ADD DATA -> import JSON
5. Przerzucić zdjęcia z example_import/images do public/images.
## 📦 Informacje o użytych pakietach
| Pakiet | Wersja | Opis |
|--------|--------|------|
| [bcrypt](https://www.npmjs.com/package/bcrypt) | 6.0.0 | Haszowanie haseł, bezpieczne logowanie. |
| [bootstrap](https://www.npmjs.com/package/bootstrap) | 5.3.7 | Framework CSS/JS do stylizacji frontendowej. |
| [cookie-parser](https://www.npmjs.com/package/cookie-parser) | ~1.4.4 | Middleware do parsowania ciasteczek. |
| [debug](https://www.npmjs.com/package/debug) | 2.6.9 | Narzędzie do logowania informacji debug. |
| [express](https://www.npmjs.com/package/express) | 4.21.2 | Główny framework webowy dla Node.js. |
| [express-async-handler](https://www.npmjs.com/package/express-async-handler) | 1.2.0 | Obsługa błędów w funkcjach async w Express. |
| [express-validator](https://www.npmjs.com/package/express-validator) | 7.2.1 | Walidacja i sanitizacja danych wejściowych. |
| [http-errors](https://www.npmjs.com/package/http-errors) | 1.6.3 | Generowanie błędów HTTP (np. 404, 500). |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | 9.0.2 | Obsługa JWT (autoryzacja, uwierzytelnianie). |
| [mongoose](https://www.npmjs.com/package/mongoose) | 8.16.0 | ODM do pracy z bazą danych MongoDB. |
| [morgan](https://www.npmjs.com/package/morgan) | 1.9.1 | Middleware do logowania zapytań HTTP. |
| [multer](https://www.npmjs.com/package/multer) | 2.0.1 | Obsługa przesyłania plików (upload, np. zdjęć). |
| [pug](https://www.npmjs.com/package/pug) | 2.0.4 | Silnik szablonów HTML używany przez Express. |
| [validator](https://www.npmjs.com/package/validator) | 13.15.15 | Walidacja i sanitizacja danych tekstowych. |

