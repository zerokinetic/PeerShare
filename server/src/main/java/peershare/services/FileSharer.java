package peershare.services;

import peershare.utils.UploadUtils;

import java.io.File;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
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
        String filePath = availableFiles.get(port);
        if (filePath.isEmpty()) {
            System.out.println("No files associated with that port: " + port);
            return;
        }

        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Serving File " + new File(filePath).getName() + " on port " + port);
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client Connection: " + clientSocket.getInetAddress());
//            new Thread(new FileSenderHandler(clientSocket, filePath)).start();
        } catch (IOException ex) {
            System.out.println("Error Handling FileServer on port: " + port);
        }
    }

    private static class FileSenderHandler implements Runnable {
        @Override
        public void run() {
            return;
        }
    }
}
