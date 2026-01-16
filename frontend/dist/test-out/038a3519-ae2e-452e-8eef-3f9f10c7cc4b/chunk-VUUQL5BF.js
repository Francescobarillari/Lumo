import {
  HttpClient,
  init_http
} from "./chunk-KDPE43GH.js";
import {
  Injectable,
  Subject,
  __decorate,
  init_core,
  init_esm,
  init_tslib_es6
} from "./chunk-3GXJXFBH.js";
import {
  __esm
} from "./chunk-6TRXNEZQ.js";

// src/services/user-service/user-service.ts
var UserService;
var init_user_service = __esm({
  "src/services/user-service/user-service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    init_esm();
    UserService = class UserService2 {
      http;
      apiUrl = "http://localhost:8080/api/users";
      constructor(http) {
        this.http = http;
      }
      getUsers() {
        return this.http.get(this.apiUrl);
      }
      getUserById(id) {
        return this.http.get(`${this.apiUrl}/${id}`);
      }
      searchUsers(query) {
        return this.http.get(`${this.apiUrl}/search?q=${query}`);
      }
      toggleSavedEvent(userId, eventId) {
        return this.http.post(`${this.apiUrl}/${userId}/saved-events/${eventId}`, {});
      }
      followUser(followerId, followedId) {
        return this.http.post(`${this.apiUrl}/${followerId}/follow/${followedId}`, {});
      }
      unfollowUser(followerId, followedId) {
        return this.http.delete(`${this.apiUrl}/${followerId}/follow/${followedId}`);
      }
      isFollowing(followerId, followedId) {
        return this.http.get(`${this.apiUrl}/${followerId}/is-following/${followedId}?t=${(/* @__PURE__ */ new Date()).getTime()}`);
      }
      getFollowNotifications(followerId, followedId) {
        return this.http.get(`${this.apiUrl}/${followerId}/follow/${followedId}/notifications?t=${(/* @__PURE__ */ new Date()).getTime()}`);
      }
      setFollowNotifications(followerId, followedId, enabled) {
        return this.http.put(`${this.apiUrl}/${followerId}/follow/${followedId}/notifications?enabled=${enabled}`, {});
      }
      getFollowers(userId) {
        return this.http.get(`${this.apiUrl}/${userId}/followers`);
      }
      getFollowing(userId) {
        return this.http.get(`${this.apiUrl}/${userId}/following`);
      }
      updateUser(userId, data) {
        return this.http.put(`${this.apiUrl}/${userId}`, data);
      }
      changePassword(userId, oldPassword, newPassword) {
        return this.http.put(`${this.apiUrl}/${userId}/password`, { oldPassword, newPassword });
      }
      userUpdated = new Subject();
      userUpdates$ = this.userUpdated.asObservable();
      notifyUserUpdate() {
        this.userUpdated.next();
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    UserService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], UserService);
  }
});

export {
  UserService,
  init_user_service
};
//# sourceMappingURL=chunk-VUUQL5BF.js.map
