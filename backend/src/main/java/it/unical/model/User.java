package it.unical.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "users")
public class User {

    @Column(name = "is_admin")
    private Boolean isAdmin = false;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String passwordHash;

    private String birthdate;

    private String profileImage;

    private byte[] profileImageData;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_participations", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "event_id"))
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Event> participatingEvents = new java.util.HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_saved", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "event_id"))
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Event> savedEvents = new java.util.HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_pending_participations", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "event_id"))
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Event> pendingEvents = new java.util.HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public byte[] getProfileImageData() {
        return profileImageData;
    }

    public void setProfileImageData(byte[] profileImageData) {
        this.profileImageData = profileImageData;
    }

    public java.util.Set<Event> getParticipatingEvents() {
        return participatingEvents;
    }

    public void setParticipatingEvents(java.util.Set<Event> participatingEvents) {
        this.participatingEvents = participatingEvents;
    }

    public java.util.Set<Event> getSavedEvents() {
        return savedEvents;
    }

    public void setSavedEvents(java.util.Set<Event> savedEvents) {
        this.savedEvents = savedEvents;
    }

    public java.util.Set<Event> getPendingEvents() {
        return pendingEvents;
    }

    public void setPendingEvents(java.util.Set<Event> pendingEvents) {
        this.pendingEvents = pendingEvents;
    }

    public Boolean getIsAdmin() {
        return isAdmin != null ? isAdmin : false;
    }

    public void setIsAdmin(Boolean admin) {
        isAdmin = admin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof User))
            return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }

}
