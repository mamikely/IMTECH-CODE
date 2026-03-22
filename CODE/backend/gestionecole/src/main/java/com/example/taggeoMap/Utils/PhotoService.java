package com.example.taggeoMap.Utils;


import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;


public class PhotoService {
    public ResponseEntity<String> updatePhoto(MultipartFile newFile, String oldFileName, String newFileName) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/Photos/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Supprimer l'ancienne photo si elle existe
            File oldFile = new File(uploadDir + oldFileName);
            if (oldFile.exists()) {
                oldFile.delete();
            }

            // Extension
            String extension = "";
            String originalFilename = newFile.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            newFileName = newFileName + extension;
            String newFilePath = uploadDir + File.separator + newFileName;

            newFile.transferTo(new File(newFilePath));

            String fileUrl = "/Photos/" + newFileName;

            return ResponseEntity.ok("Photo mise à jour avec succès : " + fileUrl);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }

    public ResponseEntity<String> deletePhoto(String namePart) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/Photos/";
            File directory = new File(uploadDir);

            if (!directory.exists() || !directory.isDirectory()) {
                return ResponseEntity.status(404).body("Répertoire photos introuvable !");
            }

            // Cherche tous les fichiers dont le nom contient namePart
            File[] matchingFiles = directory.listFiles((dir, name) -> name.contains(namePart));

            if (matchingFiles == null || matchingFiles.length == 0) {
                return ResponseEntity.status(404).body("Aucun fichier correspondant trouvé pour : " + namePart);
            }

            StringBuilder deletedFiles = new StringBuilder();
            for (File file : matchingFiles) {
                if (file.delete()) {
                    deletedFiles.append(file.getName()).append(", ");
                }
            }

            if (deletedFiles.length() > 0) {
                // Supprime la dernière virgule
                deletedFiles.setLength(deletedFiles.length() - 2);
                return ResponseEntity.ok("Photos supprimées avec succès : " + deletedFiles);
            } else {
                return ResponseEntity.status(500).body("Impossible de supprimer les fichiers correspondants !");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }
    public ResponseEntity<String> deletePdf(String namePart) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/Pdf/";
            File directory = new File(uploadDir);

            if (!directory.exists() || !directory.isDirectory()) {
                return ResponseEntity.status(404).body("Répertoire photos introuvable !");
            }

            // Cherche tous les fichiers dont le nom contient namePart
            File[] matchingFiles = directory.listFiles((dir, name) -> name.contains(namePart));

            if (matchingFiles == null || matchingFiles.length == 0) {
                return ResponseEntity.status(404).body("Aucun fichier correspondant trouvé pour : " + namePart);
            }

            StringBuilder deletedFiles = new StringBuilder();
            for (File file : matchingFiles) {
                if (file.delete()) {
                    deletedFiles.append(file.getName()).append(", ");
                }
            }

            if (deletedFiles.length() > 0) {
                // Supprime la dernière virgule
                deletedFiles.setLength(deletedFiles.length() - 2);
                return ResponseEntity.ok("Photos supprimées avec succès : " + deletedFiles);
            } else {
                return ResponseEntity.status(500).body("Impossible de supprimer les fichiers correspondants !");
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }


    public ResponseEntity<String> savePhoto(MultipartFile file, String newFileName) {
        try {
            // Répertoire externe
            String uploadDir = System.getProperty("user.dir") + "/uploads/Photos/";

            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // extension
            String extension = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            newFileName = newFileName + extension;
            String filePath = uploadDir + File.separator + newFileName;

            file.transferTo(new File(filePath));

            // URL publique si tu as configuré Spring
            String fileUrl = "/Photos/" + newFileName;


            return ResponseEntity.ok("Photo enregistrée avec succès : " + fileUrl);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }
    public ResponseEntity<String> savePDF(MultipartFile file, String newFileName) {
        try {
            // Répertoire externe
            String uploadDir = System.getProperty("user.dir") + "/uploads/Pdf/";

            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // extension
            String extension = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            newFileName = newFileName + extension;
            String filePath = uploadDir + File.separator + newFileName;

            file.transferTo(new File(filePath));

            // URL publique si tu as configuré Spring
            String fileUrl = "/Pdf/" + newFileName;


            return ResponseEntity.ok("Photo enregistrée avec succès : " + fileUrl);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }

}