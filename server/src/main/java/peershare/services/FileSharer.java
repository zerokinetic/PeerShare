package peershare.services;

import peershare.utils.UploadUtils;

import java.util.HashMap;

public class FileSharer {
    private HashMap<Integer, String> availableFiles;

    public FileSharer() {
        availableFiles = new HashMap<>();
    }
    public int offerFile(String filePath) {
        int port;
        while (true) {
            port= UploadUtils.generateCode();
            if (!availableFiles.containsKey(port)) {
                availableFiles.put(port, filePath);
                return port;
            }
        }
    }

    public void startFileServer(int port) {
        //Logic goes here
    }
}
