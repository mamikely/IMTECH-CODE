package com.example.taggeoMap.Utils;

import java.security.SecureRandom;

public class Utilis {

        private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static final int CODE_LENGTH = 10;
        private static final SecureRandom random = new SecureRandom();

        public static String generateCode() {
            StringBuilder code = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                int index = random.nextInt(CHARACTERS.length());
                code.append(CHARACTERS.charAt(index));
            }
            return code.toString();
        }


    }


