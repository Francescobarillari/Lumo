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

    @Transient
    private boolean isParticipating;

    @Transient
    private boolean isSaved;

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
        isSaved = saved;
    }
}
