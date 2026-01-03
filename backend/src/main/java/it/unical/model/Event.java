package it.unical.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int nPartecipants;
    private String city;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDateTime createdAt;
    private Double latitude;
    private Double longitude;
    private Double costPerPerson;

    @Column(columnDefinition = "boolean default false")
    private Boolean isApproved = false;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User creator;

    @Transient
    private boolean isParticipating;

    @Transient
    private boolean isSaved;

    @Transient
    private String participationStatus = "NONE"; // NONE, PENDING, ACCEPTED

    @Transient
    private java.util.List<User> pendingUsersList;

    @ManyToMany(mappedBy = "participatingEvents")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> participants = new java.util.HashSet<>();

    @ManyToMany(mappedBy = "pendingEvents")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.Set<User> pendingParticipants = new java.util.HashSet<>();

    public Event() {
    }

    public Event(Long id, String title, String description, int nPartecipants, String city, LocalDate date,
            LocalTime startTime, LocalTime endTime, LocalDateTime createdAt, Double latitude, Double longitude,
            Double costPerPerson) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.nPartecipants = nPartecipants;
        this.city = city;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
        this.latitude = latitude;
        this.longitude = longitude;
        this.costPerPerson = costPerPerson;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getnPartecipants() {
        return nPartecipants;
    }

    public void setnPartecipants(int nPartecipants) {
        this.nPartecipants = nPartecipants;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getCostPerPerson() {
        return costPerPerson;
    }

    public void setCostPerPerson(Double costPerPerson) {
        this.costPerPerson = costPerPerson;
    }

    public Boolean getIsApproved() {
        return isApproved != null ? isApproved : false;
    }

    public void setIsApproved(Boolean approved) {
        isApproved = approved;
    }

    public boolean getIsParticipating() {
        return isParticipating;
    }

    public void setIsParticipating(boolean participating) {
        isParticipating = participating;
    }

    public boolean getIsSaved() {
        return isSaved;
    }

    public void setIsSaved(boolean saved) {
        this.isSaved = saved;
    }

    public String getParticipationStatus() {
        return participationStatus;
    }

    public void setParticipationStatus(String participationStatus) {
        this.participationStatus = participationStatus;
    }

    public java.util.Set<User> getParticipants() {
        return participants;
    }

    public void setParticipants(java.util.Set<User> participants) {
        this.participants = participants;
    }

    public java.util.Set<User> getPendingParticipants() {
        return pendingParticipants;
    }

    public void setPendingParticipants(java.util.Set<User> pendingParticipants) {
        this.pendingParticipants = pendingParticipants;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public Long getCreatorId() {
        if (creator != null) {
            return creator.getId();
        }
        if (participants != null && !participants.isEmpty()) {
            return participants.iterator().next().getId();
        }
        return null;
    }

    // Questi metodi verranno serializzati nel JSON come "organizerName" e
    // "organizerImage"
    public String getOrganizerName() {
        if (creator != null) {
            return creator.getName();
        }
        if (participants != null && !participants.isEmpty()) {
            return participants.iterator().next().getName();
        }
        return "Lumo Eventer";
    }

    public String getOrganizerImage() {
        if (creator != null) {
            return creator.getProfileImage();
        }
        if (participants != null && !participants.isEmpty()) {
            return participants.iterator().next().getProfileImage();
        }
        return null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Event))
            return false;
        Event event = (Event) o;
        return id != null && id.equals(event.getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }

    public java.util.List<User> getPendingUsersList() {
        return pendingUsersList;
    }

    public void setPendingUsersList(java.util.List<User> pendingUsersList) {
        this.pendingUsersList = pendingUsersList;
    }
}
