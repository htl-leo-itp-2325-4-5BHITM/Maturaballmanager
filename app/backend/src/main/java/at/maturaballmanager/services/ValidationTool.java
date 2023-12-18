package at.maturaballmanager.services;

import java.util.regex.Pattern;

public class ValidationTool {

    private static final String WEBSITE_PATTERN = "^(http|https)://(.+)$";

    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";

    private static final String PHONE_PATTERN = "^[0-9]{10}$";

    public static String validateWebsite(String website) {
        if(Pattern.matches(WEBSITE_PATTERN, website)) {
            return website;
        }
        return null;
    }

    public static String validateEmail(String email) {
        if(Pattern.matches(EMAIL_PATTERN, email)) {
            return email;
        }
        return null;
    }

    public static String validatePhoneNumber(String phoneNumber) {
        if(Pattern.matches(PHONE_PATTERN, phoneNumber)) {
            return phoneNumber;
        }
        return null;
    }
}
