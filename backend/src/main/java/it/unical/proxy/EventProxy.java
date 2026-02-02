package it.unical.proxy;

import it.unical.model.Event;
import it.unical.model.User;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class EventProxy extends Event {
    public EventProxy() {
    }

    public EventProxy(javax.sql.DataSource ignored) {
        // Kept for backward compatibility with existing constructors in DAOs/proxies.
    }

    @Override
    public void setParticipants(Set<User> participants) {
        Set<User> accepted = sanitizeUsers(participants);
        super.setParticipants(accepted);
        super.setPendingParticipants(removeOverlaps(sanitizeUsers(super.getPendingParticipants()), accepted));
    }

    @Override
    public void setPendingParticipants(Set<User> pendingParticipants) {
        Set<User> pending = sanitizeUsers(pendingParticipants);
        Set<User> accepted = sanitizeUsers(super.getParticipants());
        super.setPendingParticipants(removeOverlaps(pending, accepted));
    }

    @Override
    public void setUsersWhoSaved(Set<User> usersWhoSaved) {
        super.setUsersWhoSaved(sanitizeUsers(usersWhoSaved));
    }

    private Set<User> sanitizeUsers(Set<User> users) {
        Map<Long, User> byId = new LinkedHashMap<>();
        if (users == null) {
            return new LinkedHashSet<>();
        }
        for (User user : users) {
            if (user == null || user.getId() == null) {
                continue;
            }
            byId.putIfAbsent(user.getId(), user);
        }
        return new LinkedHashSet<>(byId.values());
    }

    private Set<User> removeOverlaps(Set<User> source, Set<User> forbidden) {
        Set<User> result = new LinkedHashSet<>(source);
        result.removeIf(user -> forbidden.stream().anyMatch(f -> f.getId().equals(user.getId())));
        return result;
    }
}
