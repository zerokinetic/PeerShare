package peershare.utils;

import java.util.Random;

public class UploadUtils {
    public static int generateCode() {
        int DYNAMIC_STARTING_PORT = 49152;
        int DYNAMIC_ENDING_PORT = 85535;
        Random random = new Random();
        return random.nextInt((DYNAMIC_ENDING_PORT-DYNAMIC_STARTING_PORT) + DYNAMIC_STARTING_PORT);
    }
}
