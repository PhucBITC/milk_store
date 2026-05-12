package com.milkstore.dto.response;

public class AuthResponse {

    private String message;
    private UserAccountResponse user;

    public AuthResponse(String message, UserAccountResponse user) {
        this.message = message;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserAccountResponse getUser() {
        return user;
    }

    public void setUser(UserAccountResponse user) {
        this.user = user;
    }
}
