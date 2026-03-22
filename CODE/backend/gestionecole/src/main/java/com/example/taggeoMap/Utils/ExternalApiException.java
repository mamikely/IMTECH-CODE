package com.example.taggeoMap.Utils;

public class ExternalApiException extends RuntimeException {
    private final int statusCode;
    private final String responseBody;

    public ExternalApiException(int statusCode, String responseBody) {
        super("External API Error - Status: " + statusCode + ", Response: " + responseBody);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getResponseBody() {
        return responseBody;
    }
}

