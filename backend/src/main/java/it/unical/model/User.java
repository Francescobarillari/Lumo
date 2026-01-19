package it.unical.model;
public class User {
    private Boolean isAdmin = false;
    private Long id;

    private String name;
    private String email;

    private String passwordHash;

    private String birthdate;

    private String profileImage;

    private byte[] profileImageData;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Event> participatingEvents = new java.util.HashSet<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Event> savedEvents = new java.util.HashSet<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<Event> pendingEvents = new java.util.HashSet<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> following = new java.util.HashSet<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> followers = new java.util.HashSet<>();
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> followNotifications = new java.util.HashSet<>();
    private String description;
    private int approvedEventsCount = 0;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getApprovedEventsCount() {
        return approvedEventsCount;
    }

    public void setApprovedEventsCount(int approvedEventsCount) {
        this.approvedEventsCount = approvedEventsCount;
    }

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
        if (!(o instanceof User user))
            return false;
        return id != null && id.equals(user.getId());
    }

    public java.util.Set<User> getFollowing() {
        return following;
    }

    public void setFollowing(java.util.Set<User> following) {
        this.following = following;
    }

    public java.util.Set<User> getFollowers() {
        return followers;
    }

    public void setFollowers(java.util.Set<User> followers) {
        this.followers = followers;
    }

    public java.util.Set<User> getFollowNotifications() {
        return followNotifications;
    }

    public void setFollowNotifications(java.util.Set<User> followNotifications) {
        this.followNotifications = followNotifications;
    }

    public int getFollowersCount() {
        return followers.size();
    }

    public int getFollowingCount() {
        return following.size();
    }

    @Override
    public int hashCode() {
        return 31;
    }

}

