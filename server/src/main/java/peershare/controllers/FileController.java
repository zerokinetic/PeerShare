package peershare.controllers;

import com.sun.net.httpserver.HttpServer;
import peershare.services.FileSharer;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FileController {

    private final FileSharer fileSharer;
    private final HttpServer server;
    private final String uploadDir;
    private final ExecutorService executorService;

    public FileController(int port) throws IOException {
        this.fileSharer = new FileSharer();
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        this.uploadDir = System.getProperty("java.io.tempdir") + File.separator + "peershare-uploads";
        this.executorService = Executors.newFixedThreadPool(10);

        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        //Yet to implement
        server.createContext("/upload", new UploadHandler());
        server.createContext("/download", DownloadHandler());
        server.createContext("/", CORSHandler());
        server.setExecutor(executorService);
    }

    public void start() {
        server.start();
        System.out.println("Server started on port " + server.getAddress().getPort());
    }

    public void stop() {
        server.stop(0);
        executorService.shutdown();
        System.out.println("Server stopped!!");
    }
}
