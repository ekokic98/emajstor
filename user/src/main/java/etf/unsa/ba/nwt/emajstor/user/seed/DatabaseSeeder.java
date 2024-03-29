package etf.unsa.ba.nwt.emajstor.user.seed;

import etf.unsa.ba.nwt.emajstor.user.model.ContactInfo;
import etf.unsa.ba.nwt.emajstor.user.model.Role;
import etf.unsa.ba.nwt.emajstor.user.model.User;
import etf.unsa.ba.nwt.emajstor.user.repositories.ContactInfoRepository;
import etf.unsa.ba.nwt.emajstor.user.repositories.UserRepository;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseSeeder {
    private final UserRepository userRepository;
    private final ContactInfoRepository contactInfoRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, ContactInfoRepository contactInfoRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.contactInfoRepository = contactInfoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener
    public void seed(final ContextRefreshedEvent event) {
        seedDatabase();
    }

    private void seedDatabase() {
        if(contactInfoRepository.count() == 0 && userRepository.count() == 0) {
            ContactInfo contactInfo1 = createContactInfo("Admin", "Admin", "admin@emajstor.ba", "033225883");
            ContactInfo contactInfo2 = createContactInfo("Davor", "Sekulic", "davor@emajstor.ba", "062087644");
            ContactInfo contactInfo3 = createContactInfo("Elmir", "Kokic", "elmir@emajstor.ba", "062738444");
            ContactInfo contactInfo4 = createContactInfo("Tarik", "Japalak", "tarik@emajstor.ba", "062731065");

            User Davor = createUser("davor", "davor123", "Sarajevo",18.4131,43.8563, Role.ROLE_ADMIN, contactInfo2);
            User Elmir = createUser("elmir", "elmir123", "Sarajevo",18.4131,43.8563, Role.ROLE_ADMIN, contactInfo3);
            User Tarik = createUser("tarik", "tarik123", "Tarčin",18.0921,43.7937, Role.ROLE_ADMIN, contactInfo4);
            User Admin = createUser("admin", "admin123", "Sarajevo",18.4131,43.8563, Role.ROLE_ADMIN, contactInfo1);
        }
    }

    private ContactInfo createContactInfo(String firstName, String lastName, String email, String number) {
        ContactInfo contactInfo = new ContactInfo();
        contactInfo.setFirstName(firstName);
        contactInfo.setLastName(lastName);
        contactInfo.setEmail(email);
        contactInfo.setNumber(number);
        contactInfo = contactInfoRepository.save(contactInfo);
        return contactInfo;
    }

    private User createUser(String username, String password, String city, double locationLongitude, double locationLatitude, Role role, ContactInfo contactInfo) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setCity(city);
        user.setLocationLongitude(locationLongitude);
        user.setLocationLatitude(locationLatitude);
        user.setRole(role);
        user.setDateCreated(LocalDateTime.now());
        user.setContactInfo(contactInfo);
        user = userRepository.save(user);
        return user;
    }
}
