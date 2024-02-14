package at.htlleonding.services;

import java.util.regex.Pattern;

public class PatternStorage {
    private static Pattern mailAddressPattern = Pattern.compile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$");

    public static Pattern getMailAddressPattern() {
        return mailAddressPattern;
    }
}
