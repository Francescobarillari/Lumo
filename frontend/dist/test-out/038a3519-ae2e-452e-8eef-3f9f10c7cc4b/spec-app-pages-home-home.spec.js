import {
  ConfirmationService,
  init_confirmation_service
} from "./chunk-M3ZD2GP7.js";
import {
  EventCardComponent,
  EventService,
  EventShareModalComponent,
  MapView,
  MapboxService,
  MatSnackBar,
  MatSnackBarModule,
  init_event_card_component,
  init_event_service,
  init_event_share_modal_component,
  init_map_view,
  init_mapbox_service,
  init_snack_bar,
  require_browser,
  require_mapbox_gl
} from "./chunk-XCYCWIXC.js";
import {
  UserService,
  init_user_service
} from "./chunk-VUUQL5BF.js";
import {
  SignInPopup,
  init_sign_in_popup
} from "./chunk-34S66VQB.js";
import {
  ActivatedRoute,
  Router,
  init_router
} from "./chunk-YRK3FYDE.js";
import {
  VerifyEmailPopup,
  init_verify_email_popup
} from "./chunk-VAYPB4TI.js";
import {
  SignUpPopup,
  init_sign_up_popup
} from "./chunk-7TVTZCMN.js";
import "./chunk-XGGBA6TN.js";
import {
  AuthService,
  init_auth_service
} from "./chunk-4RP5LXF2.js";
import {
  FormField,
  init_form_field
} from "./chunk-HXKXDHCN.js";
import {
  Environment,
  init_environment
} from "./chunk-LIEZZHZR.js";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  init_forms
} from "./chunk-SRAAVOWE.js";
import "./chunk-JGCT3QTW.js";
import "./chunk-UGYQJEAL.js";
import {
  MatIconModule,
  init_icon
} from "./chunk-TAO542U6.js";
import "./chunk-T2MDPWXL.js";
import "./chunk-UCB5EEGK.js";
import "./chunk-AO23D4OF.js";
import {
  CommonModule,
  init_common
} from "./chunk-ZVVPXCFC.js";
import {
  HttpClient,
  init_http
} from "./chunk-KDPE43GH.js";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injectable,
  Input,
  Output,
  TestBed,
  ViewChild,
  __decorate,
  init_core,
  init_esm,
  init_testing,
  init_tslib_es6,
  interval,
  switchMap
} from "./chunk-3GXJXFBH.js";
import {
  __async,
  __commonJS,
  __esm,
  __toESM
} from "./chunk-6TRXNEZQ.js";

// angular:jit:template:src/app/pages/home/home.html
var home_default;
var init_home = __esm({
  "angular:jit:template:src/app/pages/home/home.html"() {
    home_default = `<div class="home-container">
  @if (!loggedUser) {
  <div class="top-bar">
    <a class="button" (click)="openSignUp()">Sign Up</a>
    <a class="button" (click)="openSignIn()">Sign In</a>
  </div>
  } @else {
  <app-action-bar [loggedUser]="loggedUser" (action)="onMenuAction($event)" (openProfile)="openUserProfile($event)"
    (openChatFromNotification)="onChatNotification($event)"
    (openEventFromNotification)="onUpcomingEventNotification($event)"
    (focusEvent)="onFocusEventFromMenu($event)"></app-action-bar>

  <!-- Hidden input for file selection triggered by menu -->
  <input id="hiddenFileInput" type="file" (change)="onFileSelected($event)" style="display: none" accept="image/*">
  }

  @if (showSignUp) {
  <SignUpPopup (switchToSignIn)="switchToSignIn()" (close)="closeAll()"
    (signUpSuccess)="openVerifyPopup($event.email, $event.token)" (signInSuccess)="onSignInSuccess($event)" />
  }

  @if (showVerifyPopup) {
  <VerifyEmailPopup [email]="recentEmail" [token]="recentToken" [verified]="emailVerified" (close)="closeAll()"
    (resendVerification)="resendEmail()" />
  }

  @if (showSignIn) {
  <SignInPopup (switchToSignUp)="switchToSignUp()" (close)="closeAll()" (signInSuccess)="onSignInSuccess($event)" />
  }

  @if (showUserProfile) {
  <app-user-profile-modal [userId]="selectedUserProfileId"
    [currentUserId]="loggedUser ? (loggedUser.id.toString()) : null" (close)="closeAll()"
    (openProfile)="openUserProfile($event)" (focusEvent)="onFocusEventFromProfile($event)"></app-user-profile-modal>
  }

  <map-view [userId]="loggedUser ? loggedUser.id || '' : null" (eventSelected)="openEventPopup($event)"
    (mapInteract)="closeEventPopup()" (requestLogin)="openSignIn()" (eventsUpdated)="onEventsUpdated($event)"
    (openUserProfile)="openUserProfile($event)">
  </map-view>

  @if (showCropPopup && selectedImageFile) {
  <CropImagePopup [imageFile]="selectedImageFile" (close)="showCropPopup = false"
    (imageCropped)="onImageCropped($event)">
  </CropImagePopup>
  }

  @if (showCreateEventPopup) {
  <create-event-popup #createEventPopup [style.display]="showLocationSelector ? 'none' : 'block'"
    (close)="showCreateEventPopup = false" (eventCreated)="closeAll()"
    (openLocationSelector)="createEventPopupRef = createEventPopup; openLocationSelector()">
  </create-event-popup>
  }

  @if (showLocationSelector) {
  <map-location-selector (locationSelected)="onLocationSelected($event)" (close)="showLocationSelector = false">
  </map-location-selector>
  }

  @if (selectedEvent) {
  <event-popup-card [event]="selectedEvent" [eventPosition]="eventScreenPosition || undefined"
    (close)="closeEventPopup()" (participate)="onParticipate($event)" (toggleFavorite)="onToggleFavorite()"
    [organizerName]="selectedEvent.organizerName || ''" [organizerImage]="selectedEvent.organizerImage"
    [currentUserId]="loggedUser ? (loggedUser.id ? loggedUser.id.toString() : null) : null"
    [creatorId]="selectedEvent.creatorId" (openOrganizerProfile)="openUserProfile($event)"
    (leave)="onLeaveEvent($event)" (deleteEvent)="onDeleteEvent($event)" (shareEvent)="openShare($event)"
    (openChat)="openChat($event)" />
  }

  @if (showChatModal && chatEvent) {
  <event-chat-modal [event]="chatEvent" [currentUserId]="loggedUser?.id?.toString() || null" (close)="closeChat()">
  </event-chat-modal>
  }
</div>
`;
  }
});

// angular:jit:style:src/app/pages/home/home.css
var home_default2;
var init_home2 = __esm({
  "angular:jit:style:src/app/pages/home/home.css"() {
    home_default2 = "/* src/app/pages/home/home.css */\n.top-bar {\n  display: flex;\n  flex-direction: row;\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  gap: 8px;\n  z-index: 1000;\n  background: var(--color-dark-gray);\n  padding: 8px;\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);\n  box-sizing: border-box;\n  border: 1px solid var(--color-light-gray);\n  align-items: center;\n}\n@media (max-width: 768px) {\n  .top-bar {\n    top: 20px;\n    bottom: auto;\n    right: auto;\n    left: 50%;\n    transform: translateX(-50%);\n    width: 90%;\n    justify-content: center;\n    background: rgba(26, 26, 26, 0.95);\n    -webkit-backdrop-filter: blur(10px);\n    backdrop-filter: blur(10px);\n  }\n  .top-bar .button {\n    flex: 1;\n    font-size: 14px;\n    height: 44px;\n  }\n}\n/*# sourceMappingURL=home.css.map */\n";
  }
});

// angular:jit:template:src/components/action-bar/action-bar.html
var action_bar_default;
var init_action_bar = __esm({
  "angular:jit:template:src/components/action-bar/action-bar.html"() {
    action_bar_default = `<div class="action-bar">
    <button class="add-event-btn button" (click)="onAddEvent()">Add Event</button>

    <div class="icon-circle notification-icon" (click)="toggleNotifications($event)">
        <mat-icon>notifications</mat-icon>
        @if (hasUnread) {
        <span class="unread-indicator"></span>
        }
        @if (showNotifications) {
        <notification-menu [userId]="loggedUser?.id || 0" (click)="$event.stopPropagation()"
            (openChat)="onOpenChatFromNotification($event)" (openEvent)="onOpenEventFromNotification($event)"
            (close)="showNotifications = false"></notification-menu>
        }
    </div>

    <div class="profile-trigger" (click)="toggleUserMenu($event)">
        @if (loggedUser?.profileImage) {
        <img [src]="loggedUser?.profileImage" alt="Profile" class="profile-image">
        } @else {
        <div class="profile-placeholder">{{ getInitials(loggedUser?.name || loggedUser?.email || '') }}</div>
        }
        @if (showUserMenu) {
        <UserMenu (click)="$event.stopPropagation()" (close)="showUserMenu = false" (action)="onMenuAction($event)">
        </UserMenu>
        }

    </div>

</div>

@if (showMyEventsModal) {
<app-my-events-modal [userId]="loggedUser?.id || 0" (close)="showMyEventsModal = false"
    (focusLocal)="onFocusEvent($event)"></app-my-events-modal>
}

@if (showAccountModal) {
<app-account-modal [user]="loggedUser" (close)="showAccountModal = false" (changePhoto)="onChangePhotoFromAccount()"
    (openProfile)="onOpenProfileFromAccount($event)">
</app-account-modal>
}
`;
  }
});

// angular:jit:style:src/components/action-bar/action-bar.css
var action_bar_default2;
var init_action_bar2 = __esm({
  "angular:jit:style:src/components/action-bar/action-bar.css"() {
    action_bar_default2 = "/* src/components/action-bar/action-bar.css */\n.action-bar {\n  height: 72px;\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  background: var(--color-dark-gray);\n  padding: 12px;\n  border-radius: var(--radius-2xl);\n  box-shadow: var(--shadow-lg);\n  z-index: var(--z-action-bar);\n  width: auto;\n  box-sizing: border-box;\n  border: 1px solid var(--color-light-gray);\n}\n.action-bar .add-event-btn {\n  height: 44px;\n  cursor: pointer;\n  transition: transform 0.1s ease, filter 0.2s;\n}\n.add-event-btn:hover {\n  filter: brightness(1.1);\n  transform: scale(1.02);\n}\n.profile-trigger {\n  height: 44px;\n  width: 44px;\n  border-radius: var(--radius-full);\n  overflow: hidden;\n  cursor: pointer;\n  border: 1px solid transparent;\n  transition: border-color 0.2s;\n  background-color: var(--color-dark-gray);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.profile-trigger:hover {\n  border-color: var(--color-accent);\n}\n.profile-image {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.profile-placeholder {\n  color: var(--color-white);\n  font-weight: var(--font-weight-semibold);\n  font-size: 16px;\n}\n.icon-circle {\n  width: 44px;\n  height: 44px;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: var(--radius-full);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: background-color 0.2s, transform 0.2s;\n}\n.icon-circle mat-icon {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n  color: var(--color-white);\n}\n.icon-circle:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n.notification-icon {\n  margin-right: 4px;\n  margin-left: 4px;\n  position: relative;\n}\n.unread-indicator {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  width: 10px;\n  height: 10px;\n  background-color: var(--color-accent);\n  border-radius: var(--radius-full);\n  border: 2px solid var(--color-dark-gray);\n  z-index: 10;\n}\nnotification-menu {\n  position: absolute;\n  top: 70px;\n  right: -70px;\n  z-index: var(--z-dropdown);\n}\n@media (max-width: 768px) {\n  .action-bar {\n    top: 20px;\n    bottom: auto;\n    right: 20px;\n    padding: 8px;\n    height: 60px;\n  }\n}\n/*# sourceMappingURL=action-bar.css.map */\n";
  }
});

// angular:jit:template:src/components/user-menu/user-menu.html
var user_menu_default;
var init_user_menu = __esm({
  "angular:jit:template:src/components/user-menu/user-menu.html"() {
    user_menu_default = `<div class="menu-backdrop" (click)="close.emit()"></div>
<div class="menu-container">
  <div class="menu-header mobile-header">
    <mat-icon (click)="close.emit()">arrow_back</mat-icon>
    <h1>Menu</h1>
  </div>
  <div class="menu-item-container">
    <div class="menu-item" (click)="onAction('account')">
      <i class="icon">\u{1F464}</i> Account
    </div>

    <div class="menu-item" (click)="onAction('my-events')">
      <i class="icon">\u2795</i> My events
    </div>
    <div class="menu-item logout" (click)="onAction('logout')">
      <i class="icon">\u{1F6AA}</i> Logout
    </div>
  </div>

</div>
`;
  }
});

// angular:jit:style:src/components/user-menu/user-menu.css
var user_menu_default2;
var init_user_menu2 = __esm({
  "angular:jit:style:src/components/user-menu/user-menu.css"() {
    user_menu_default2 = "/* src/components/user-menu/user-menu.css */\n:host {\n  display: contents;\n}\n.menu-backdrop {\n  position: fixed;\n  inset: 0;\n  background: transparent;\n}\n.menu-container {\n  position: absolute;\n  top: calc(100% + 10px);\n  right: 0;\n  width: 100%;\n  background: var(--color-dark-gray);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-lg);\n  z-index: var(--z-dropdown);\n  animation: menuFadeIn 0.2s ease-out;\n  transform-origin: top right;\n  overflow: hidden;\n}\n@keyframes menuFadeIn {\n  from {\n    opacity: 0;\n    transform: scale(0.95) translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n.menu-item-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n}\n.menu-item {\n  display: flex;\n  align-items: center;\n  padding: 16px 20px;\n  color: var(--color-white);\n  font-size: 15px;\n  font-weight: var(--font-weight-regular);\n  cursor: pointer;\n  width: 100%;\n  justify-content: center;\n  transition: all 0.2s ease;\n  border-bottom: 1px solid var(--color-bit-gray);\n}\n.menu-item:hover {\n  background: rgba(255, 255, 255, 0.05);\n  color: var(--color-white);\n}\n.menu-item:last-child {\n  border-bottom: none;\n}\n.menu-item .icon {\n  font-style: normal;\n  font-size: 16px;\n  display: none;\n}\n.menu-item.logout {\n  color: var(--color-error);\n}\n.menu-item.logout:hover {\n  background: rgba(255, 107, 107, 0.1);\n  color: var(--color-error);\n}\n.mobile-only {\n  display: none !important;\n}\n@media (max-width: 767px) {\n  .menu-container {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    border-radius: 0;\n    z-index: var(--z-popup);\n    padding-top: 0;\n    transform-origin: center;\n    background: var(--color-dark-gray);\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: center;\n    background:\n      linear-gradient(\n        160deg,\n        rgba(20, 20, 20),\n        rgba(12, 12, 12));\n    overflow-y: auto;\n  }\n  .menu-item {\n    width: 100%;\n    padding: 24px 30px;\n    font-size: 28px;\n    border-bottom: 1px solid var(--color-bit-gray);\n    justify-content: center;\n  }\n  .mobile-only {\n    display: flex !important;\n  }\n}\n/*# sourceMappingURL=user-menu.css.map */\n";
  }
});

// src/components/user-menu/user-menu.ts
var UserMenu;
var init_user_menu3 = __esm({
  "src/components/user-menu/user-menu.ts"() {
    "use strict";
    init_tslib_es6();
    init_user_menu();
    init_user_menu2();
    init_core();
    init_common();
    init_icon();
    UserMenu = class UserMenu2 {
      close = new EventEmitter();
      action = new EventEmitter();
      onAction(actionName) {
        this.action.emit(actionName);
        this.close.emit();
      }
      static propDecorators = {
        close: [{ type: Output }],
        action: [{ type: Output }]
      };
    };
    UserMenu = __decorate([
      Component({
        selector: "UserMenu",
        standalone: true,
        imports: [CommonModule, MatIconModule],
        template: user_menu_default,
        styles: [user_menu_default2]
      })
    ], UserMenu);
  }
});

// angular:jit:template:src/components/notification-menu/notification-menu.html
var notification_menu_default;
var init_notification_menu = __esm({
  "angular:jit:template:src/components/notification-menu/notification-menu.html"() {
    notification_menu_default = `<div class="notif-container">
    <div class="notif-header">
        <mat-icon (click)="close.emit()" class="mobile-only back-arrow">arrow_back</mat-icon>
        <div class="title-wrap">
            <h1>Notifications</h1>
        </div>
        <div class="header-actions">
            <button class="pill-btn" (click)="deleteRead()" title="Delete read notifications">
                <mat-icon>delete_sweep</mat-icon>
            </button>
            <!-- Close button only on mobile if it's meant to be an X, but user asked for back arrow.
                 Wrapping the old close button as per previous turn logic but keeping it hidden if back arrow is preferred. -->
        </div>
    </div>
    <div class="notif-list">
        @if (notifications.length === 0) {
        <div class="empty-state">No notifications</div>
        } @else {
        @for (n of notifications; track n.id) {
        <div class="notif-item" [class.unread]="!n.isRead" (click)="onNotificationClick(n)">
            <div class="icon-section">
                <mat-icon [style.color]="getIconColor(n.type)">{{ getIcon(n.type) }}</mat-icon>
            </div>

            <div class="content-section">
                <div class="notif-top">
                    <span class="notif-title">{{ n.title }}</span>
                    <span class="notif-time">{{ n.createdAt | date:'short' }}</span>
                </div>

                <div class="notif-msg" [class.expanded]="expandedId === n.id">
                    {{ n.message }}
                </div>

                @if (n.type === 'PARTICIPATION_REQUEST') {
                <div class="action-buttons">
                    <div class="btn-approve" (click)="acceptRequest(n, $event)" title="Accept">
                        <mat-icon>check</mat-icon>
                    </div>
                    <div class="btn-reject" (click)="rejectRequest(n, $event)" title="Reject">
                        <mat-icon>close</mat-icon>
                    </div>
                </div>
                }

                @if (n.type === 'REQUEST_ACCEPTED') {
                <div class="status-msg success">
                    <mat-icon>check_circle</mat-icon> Accepted
                </div>
                }

                @if (n.type === 'REQUEST_REJECTED') {
                <div class="status-msg error">
                    <mat-icon>cancel</mat-icon> Rejected
                </div>
                }

                @if (n.message.length > 100) {
                <div class="expand-btn" (click)="toggleExpand(n.id, $event)">
                    <mat-icon>{{ expandedId === n.id ? 'expand_less' : 'expand_more' }}</mat-icon>
                </div>
                }
            </div>
        </div>
        }
        }
    </div>
</div>
`;
  }
});

// angular:jit:style:src/components/notification-menu/notification-menu.css
var notification_menu_default2;
var init_notification_menu2 = __esm({
  "angular:jit:style:src/components/notification-menu/notification-menu.css"() {
    notification_menu_default2 = "/* src/components/notification-menu/notification-menu.css */\n.notif-container {\n  background:\n    linear-gradient(\n      160deg,\n      rgba(20, 20, 20, 0.96),\n      rgba(12, 12, 12, 0.98));\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  width: 340px;\n  border-radius: 18px;\n  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  max-height: 460px;\n  color: var(--color-white);\n  font-family: var(--font-stack-headline);\n}\n.notif-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  column-gap: 12px;\n  height: 64px;\n  padding: 0 20px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n  background:\n    radial-gradient(\n      circle at 20% 20%,\n      rgba(252, 195, 36, 0.1),\n      transparent 38%);\n}\n.notif-header h1 {\n  margin: 0;\n  font-size: 22px;\n  font-weight: var(--font-weight-bold);\n  letter-spacing: 0.2px;\n  display: flex;\n  padding-bottom: 0;\n  align-items: center;\n  height: 40px;\n  line-height: 1;\n}\n.title-wrap {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex: 1;\n  height: 40px;\n  color: var(--color-white);\n}\n.header-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  justify-content: flex-end;\n}\n.pill-btn {\n  width: 40px;\n  height: 40px;\n  display: grid;\n  place-items: center;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  background: rgba(255, 255, 255, 0.05);\n  color: var(--color-white);\n  cursor: pointer;\n  transition:\n    background 0.2s,\n    border-color 0.2s,\n    transform 0.1s,\n    color 0.2s;\n}\n.pill-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: rgba(255, 255, 255, 0.2);\n  transform: translateY(-1px);\n}\n.pill-btn:active {\n  transform: translateY(0);\n}\n.pill-btn mat-icon {\n  font-size: 20px;\n}\n.notif-list {\n  overflow-y: auto;\n  max-height: 380px;\n  padding: 8px 4px 10px;\n}\n.notif-list::-webkit-scrollbar {\n  width: 6px;\n}\n.notif-list::-webkit-scrollbar-track {\n  background: var(--color-dark-gray);\n}\n.notif-list::-webkit-scrollbar-thumb {\n  background: var(--color-bit-gray);\n  border-radius: 3px;\n}\n.notif-list::-webkit-scrollbar-thumb:hover {\n  background: var(--color-light-gray);\n}\n.notif-item {\n  display: flex;\n  padding: 12px 14px;\n  margin: 6px 8px;\n  border-radius: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n  transition:\n    background 0.2s,\n    border-color 0.2s,\n    transform 0.15s;\n  align-items: flex-start;\n  gap: var(--spacing-md);\n  position: relative;\n  background: rgba(255, 255, 255, 0.02);\n}\n.notif-item:hover {\n  background: rgba(255, 255, 255, 0.05);\n  border-color: rgba(255, 255, 255, 0.12);\n  transform: translateY(-1px);\n}\n.notif-item.unread {\n  background: rgba(252, 195, 36, 0.08);\n  border-color: rgba(252, 195, 36, 0.24);\n}\n.icon-section {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 2px;\n}\n.content-section {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.notif-top {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n  margin-bottom: var(--spacing-xs);\n}\n.notif-title {\n  font-weight: var(--font-weight-semibold);\n  font-size: 14px;\n  color: var(--color-white);\n}\n.notif-time {\n  font-size: 10px;\n  opacity: 0.6;\n  margin-left: var(--spacing-sm);\n  white-space: nowrap;\n}\n.notif-msg {\n  font-size: 13px;\n  opacity: 0.82;\n  line-height: 1.45;\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  transition: max-height 0.3s ease;\n}\n.notif-msg.expanded {\n  -webkit-line-clamp: unset;\n  overflow: visible;\n}\n.expand-btn {\n  cursor: pointer;\n  opacity: 0.6;\n  transition: opacity 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.expand-btn:hover {\n  opacity: 1;\n}\n.empty-state {\n  padding: 28px 18px 34px;\n  text-align: center;\n  opacity: 0.6;\n  font-style: italic;\n  font-size: 13px;\n}\n.action-buttons {\n  display: flex;\n  gap: var(--spacing-sm);\n  margin-left: auto;\n  align-items: center;\n  padding-left: var(--spacing-sm);\n  margin-top: 8px;\n}\n.btn-approve,\n.btn-reject {\n  width: 28px;\n  height: 28px;\n  border-radius: var(--radius-full);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: transform 0.2s, background-color 0.2s;\n}\n.btn-approve {\n  background-color: rgba(76, 175, 80, 0.2);\n  color: #4caf50;\n}\n.btn-approve:hover {\n  background-color: rgba(76, 175, 80, 0.4);\n  transform: scale(1.1);\n}\n.btn-reject {\n  background-color: rgba(244, 67, 54, 0.2);\n  color: #f44336;\n}\n.btn-reject:hover {\n  background-color: rgba(244, 67, 54, 0.4);\n  transform: scale(1.1);\n}\n.btn-approve mat-icon,\n.btn-reject mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.status-msg {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-xs);\n  font-size: 12px;\n  font-weight: var(--font-weight-medium);\n  margin-left: auto;\n  padding-left: var(--spacing-sm);\n  white-space: nowrap;\n  margin-top: 5px;\n}\n.status-msg mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n.status-msg.success {\n  color: #4caf50;\n}\n.status-msg.error {\n  color: #f44336;\n}\n@media (max-width: 768px) {\n  .notif-container {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    max-height: none;\n    border-radius: 0;\n    z-index: 100001;\n    background-color: var(--color-dark-gray);\n  }\n  .notif-header {\n    height: 70px;\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 24px;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  }\n  .title-wrap {\n    margin: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    pointer-events: none;\n    z-index: 5;\n  }\n  .notif-header h1 {\n    font-size: 24px !important;\n    color: var(--color-accent) !important;\n    text-align: center;\n    margin: 0 !important;\n    width: auto !important;\n    height: 100% !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    line-height: normal !important;\n  }\n  .back-arrow {\n    position: absolute;\n    left: 24px;\n    font-size: 24px;\n    cursor: pointer;\n    color: var(--color-white);\n    display: flex !important;\n    align-items: center;\n    justify-content: center;\n    z-index: 10;\n    height: 100%;\n    top: 0;\n  }\n  .header-actions {\n    position: absolute;\n    right: 24px;\n    z-index: 10;\n    display: flex;\n    align-items: center;\n    height: 100%;\n    top: 0;\n  }\n  .notif-list {\n    max-height: none;\n    flex: 1;\n    padding-bottom: 20px;\n  }\n  .notif-item {\n    padding: var(--spacing-lg);\n  }\n  .notif-title {\n    font-size: 18px;\n  }\n  .notif-msg {\n    font-size: 16px;\n  }\n  .btn-approve,\n  .btn-reject {\n    width: 44px;\n    height: 44px;\n  }\n  .btn-approve mat-icon,\n  .btn-reject mat-icon {\n    font-size: 24px;\n    width: 24px;\n    height: 24px;\n  }\n}\n/*# sourceMappingURL=notification-menu.css.map */\n";
  }
});

// src/services/notification.service.ts
var NotificationService;
var init_notification_service = __esm({
  "src/services/notification.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    NotificationService = class NotificationService2 {
      http;
      apiUrl = "http://localhost:8080/api/notifications";
      constructor(http) {
        this.http = http;
      }
      getNotifications(userId) {
        return this.http.get(`${this.apiUrl}?userId=${userId}`);
      }
      markAsRead(notificationId) {
        return this.http.post(`${this.apiUrl}/${notificationId}/read`, {});
      }
      markAllAsRead(userId) {
        return this.http.post(`${this.apiUrl}/read-all?userId=${userId}`, {});
      }
      updateType(notificationId, newType) {
        return this.http.post(`${this.apiUrl}/${notificationId}/type?newType=${newType}`, {});
      }
      deleteNotification(notificationId) {
        return this.http.delete(`${this.apiUrl}/${notificationId}`);
      }
      deleteReadNotifications(userId) {
        return this.http.delete(`${this.apiUrl}/read?userId=${userId}`);
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    NotificationService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], NotificationService);
  }
});

// src/components/notification-menu/notification-menu.ts
var NotificationMenuComponent;
var init_notification_menu3 = __esm({
  "src/components/notification-menu/notification-menu.ts"() {
    "use strict";
    init_tslib_es6();
    init_notification_menu();
    init_notification_menu2();
    init_core();
    init_common();
    init_icon();
    init_notification_service();
    init_event_service();
    NotificationMenuComponent = class NotificationMenuComponent2 {
      notifService;
      eventService;
      eRef;
      userId;
      close = new EventEmitter();
      openChat = new EventEmitter();
      openEvent = new EventEmitter();
      notifications = [];
      expandedId = null;
      constructor(notifService, eventService, eRef) {
        this.notifService = notifService;
        this.eventService = eventService;
        this.eRef = eRef;
      }
      ngOnInit() {
        this.loadNotifications();
      }
      loadNotifications() {
        if (!this.userId)
          return;
        this.notifService.getNotifications(this.userId).subscribe((list) => {
          this.notifications = list.map((n) => this.translateNotification(n));
        });
      }
      translateNotification(n) {
        const quotedParts = (n.message || "").match(/["']([^"']+)["']/g)?.map((m) => m.slice(1, -1)) || [];
        const eventName = quotedParts.length ? quotedParts[quotedParts.length - 1] : "";
        const firstQuoted = quotedParts[0] || "";
        switch (n.type) {
          case "APPROVED":
            n.title = "Event Approved";
            if (eventName) {
              n.message = `Your event '${eventName}' has been approved and is now visible!`;
            } else {
              n.message = "Your event has been approved and is now visible!";
            }
            break;
          case "REJECTED":
            n.title = "Event Rejected";
            if (eventName) {
              n.message = `Your event '${eventName}' has been rejected.`;
            } else {
              n.message = "Your event has been rejected.";
            }
            break;
          case "PARTICIPATION_REQUEST":
            n.title = "Participation Request";
            if (quotedParts.length >= 2) {
              n.message = `User '${firstQuoted}' wants to join event '${eventName}'.`;
            } else if (eventName) {
              n.message = `A user wants to join event '${eventName}'.`;
            } else {
              n.message = "A user requested to join your event.";
            }
            break;
          case "PARTICIPATION_ACCEPTED":
            n.title = "Request Accepted";
            n.message = "Your request to join the event has been accepted!";
            break;
          case "PARTICIPATION_REJECTED":
            n.title = "Request Rejected";
            n.message = "Your request to join the event has been rejected.";
            break;
          case "PARTICIPATION_REMOVED":
            n.title = "Removed from Event";
            if (eventName) {
              n.message = `You have been removed from the event '${eventName}'.`;
            } else {
              n.message = "You have been removed from the event.";
            }
            break;
          case "REQUEST_ACCEPTED":
            n.title = "Request Accepted";
            break;
          case "REQUEST_REJECTED":
            n.title = "Request Rejected";
            break;
          case "CHAT_MESSAGE":
            n.title = "New chat message";
            break;
        }
        return n;
      }
      toggleExpand(id, event) {
        event.stopPropagation();
        this.expandedId = this.expandedId === id ? null : id;
      }
      deleteRead() {
        if (!this.userId)
          return;
        this.notifService.deleteReadNotifications(this.userId).subscribe({
          next: () => {
            this.notifications = this.notifications.filter((n) => !n.isRead);
          },
          error: (err) => console.error("Error deleting read notifications", err)
        });
      }
      acceptRequest(n, event) {
        event.stopPropagation();
        console.log("Attempting to accept request:", n);
        if (n.relatedEventId && n.relatedUserId) {
          console.log("IDs found, calling service...");
          this.eventService.acceptParticipation(n.relatedEventId, n.relatedUserId).subscribe({
            next: () => {
              console.log("Participation accepted successfully");
              this.notifService.updateType(n.id, "REQUEST_ACCEPTED").subscribe(() => {
                this.notifService.markAsRead(n.id).subscribe(() => this.loadNotifications());
              });
            },
            error: (err) => console.error("Error accepting participation", err)
          });
        } else {
          console.error("Missing relatedEventId or relatedUserId in notification:", n);
        }
      }
      rejectRequest(n, event) {
        event.stopPropagation();
        if (n.relatedEventId && n.relatedUserId) {
          this.eventService.rejectParticipation(n.relatedEventId, n.relatedUserId).subscribe({
            next: () => {
              this.notifService.updateType(n.id, "REQUEST_REJECTED").subscribe(() => {
                this.notifService.markAsRead(n.id).subscribe(() => this.loadNotifications());
              });
            },
            error: (err) => console.error("Error rejecting participation", err)
          });
        }
      }
      delete(event, n) {
        event.stopPropagation();
        this.notifService.deleteNotification(n.id).subscribe({
          next: () => {
            this.notifications = this.notifications.filter((item) => item.id !== n.id);
          },
          error: (err) => console.error("Error deleting notification", err)
        });
      }
      onNotificationClick(n) {
        if (n.type === "CHAT_MESSAGE") {
          if (!n.relatedEventId) {
            console.error("Missing relatedEventId in chat notification:", n);
            return;
          }
          this.openChat.emit(n.relatedEventId);
          this.close.emit();
          return;
        }
        if (n.type === "FOLLOWUP") {
          if (!n.relatedEventId) {
            console.error("Missing relatedEventId in followup notification:", n);
            return;
          }
          this.openEvent.emit(n.relatedEventId);
          this.close.emit();
        }
      }
      getIcon(type) {
        switch (type) {
          case "APPROVED":
            return "check_circle";
          case "REJECTED":
            return "cancel";
          case "FOLLOWUP":
            return "event_available";
          case "PARTICIPATION_REQUEST":
            return "person_add";
          case "PARTICIPATION_ACCEPTED":
            return "how_to_reg";
          case "PARTICIPATION_REJECTED":
            return "person_remove";
          case "PARTICIPATION_REMOVED":
            return "person_remove";
          case "REQUEST_ACCEPTED":
            return "check_circle";
          case "REQUEST_REJECTED":
            return "cancel";
          case "CHAT_MESSAGE":
            return "chat";
          case "SUCCESS":
            return "check_circle";
          case "ERROR":
            return "error";
          case "WARNING":
            return "warning";
          default:
            return "notifications";
        }
      }
      getIconColor(type) {
        switch (type) {
          case "APPROVED":
            return "var(--color-accent)";
          case "REJECTED":
            return "#ff4444";
          case "FOLLOWUP":
            return "#4caf50";
          case "PARTICIPATION_REQUEST":
            return "#2196f3";
          case "PARTICIPATION_ACCEPTED":
            return "#4caf50";
          case "PARTICIPATION_REJECTED":
            return "#ff4444";
          case "PARTICIPATION_REMOVED":
            return "#ff4444";
          case "CHAT_MESSAGE":
            return "var(--color-accent)";
          default:
            return "white";
        }
      }
      static ctorParameters = () => [
        { type: NotificationService },
        { type: EventService },
        { type: ElementRef }
      ];
      static propDecorators = {
        userId: [{ type: Input }],
        close: [{ type: Output }],
        openChat: [{ type: Output }],
        openEvent: [{ type: Output }]
      };
    };
    NotificationMenuComponent = __decorate([
      Component({
        selector: "notification-menu",
        standalone: true,
        imports: [CommonModule, MatIconModule],
        template: notification_menu_default,
        styles: [notification_menu_default2]
      })
    ], NotificationMenuComponent);
  }
});

// angular:jit:template:src/components/my-events-modal/my-events-modal.html
var my_events_modal_default;
var init_my_events_modal = __esm({
  "angular:jit:template:src/components/my-events-modal/my-events-modal.html"() {
    my_events_modal_default = `@if (!showChatModal) {
<div class="backdrop" (click)="close.emit()"></div>

<div class="modal-container">
    <div class="modal-header">
        <mat-icon (click)="onBack()" class="back-arrow">arrow_back</mat-icon>

        <div class="tabs tablet-desktop-only">
            <button class="tab-btn" [class.active]="activeTab === 'ORGANIZED'" (click)="switchTab('ORGANIZED')">
                My Events
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'JOINED'" (click)="switchTab('JOINED')">
                Joined Events
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'SAVED'" (click)="switchTab('SAVED')">
                Saved Events
            </button>
        </div>

        <div class="title-wrap mobile-only">
            <h2 class="yellow-title">{{ getViewTitle() }}</h2>
        </div>

        <button class="close-btn tablet-desktop-only" (click)="close.emit()">
            <mat-icon>close</mat-icon>
        </button>
    </div>

    <!-- Mobile Tab Bar -->
    <div class="mobile-tabs mobile-only">
        <button class="mobile-tab-btn" [class.active]="activeTab === 'ORGANIZED'" (click)="switchTab('ORGANIZED')">
            <mat-icon>event</mat-icon>
            <span>My Events</span>
        </button>
        <button class="mobile-tab-btn" [class.active]="activeTab === 'JOINED'" (click)="switchTab('JOINED')">
            <mat-icon>group</mat-icon>
            <span>Joined</span>
        </button>
        <button class="mobile-tab-btn" [class.active]="activeTab === 'SAVED'" (click)="switchTab('SAVED')">
            <mat-icon>bookmark</mat-icon>
            <span>Saved</span>
        </button>
    </div>

    <div class="modal-content">
        @if (loading) {
        <div class="loading-state">Loading...</div>
        }

        @if (!loading && activeTab === 'ORGANIZED') {
        <div class="events-list" [class.has-expanded-requests]="expandedEventRequestsId">
            @for (event of organizedEvents; track event.id) {
            <div class="organized-event-item" [class.expanded]="expandedEventRequestsId === event.id">
                <div class="event-summary">
                    <div class="event-info">
                        <h3>{{ event.title }}</h3>
                        <span class="event-location">{{ event.city }}</span>
                        <span class="event-date">{{ formatDateTime(event) }}</span>
                        <span class="requests-badge" *ngIf="event.pendingUsersList?.length"
                            (click)="toggleRequests(event.id)">
                            {{ event.pendingUsersList?.length }} Requests
                        </span>
                    </div>
                    <div class="event-actions">
                        <button class="icon-btn chat" (click)="openChat(event)" title="Open chat">
                            <mat-icon>chat</mat-icon>
                        </button>
                        <button class="icon-btn danger" (click)="deleteEvent(event)" title="Delete event">
                            <mat-icon>delete</mat-icon>
                        </button>
                        <button class="icon-btn" (click)="toggleRequests(event.id)" title="Manage Requests">
                            <mat-icon>group</mat-icon>
                        </button>
                    </div>
                </div>

                <!-- Requests Section -->
                @if (expandedEventRequestsId === event.id) {
                <div class="requests-panel">
                    <!-- Event Overview Section -->
                    <div class="event-overview-section">
                        <h4>Event Overview</h4>
                        <div class="stats-card">
                            <div class="stat-item">
                                <span class="stat-label">Accepted Participants</span>
                                <span class="stat-value">{{ event.acceptedUsersList?.length || 0 }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Capacity</span>
                                <span class="stat-value">
                                    {{ event.acceptedUsersList?.length || 0 }} / {{ event.nPartecipants }}
                                </span>
                            </div>
                        </div>

                        @if (event.acceptedUsersList?.length) {
                        <div class="participants-list">
                            <h5 class="section-subtitle">Accepted People</h5>
                            <div class="participants-grid">
                                @for (user of event.acceptedUsersList; track user.id) {
                                <div class="participant-chip">
                                    <img [src]="user.profileImage || 'assets/placeholder-user.png'"
                                        class="participant-avatar">
                                    <span class="participant-name">{{ user.name }} {{ user.surname }}</span>
                                    <button class="participant-remove-btn" type="button"
                                        (click)="removeParticipant(event, user)" title="Remove participant">
                                        <mat-icon>person_remove</mat-icon>
                                    </button>
                                </div>
                                }
                            </div>
                        </div>
                        } @else {
                        <p class="no-data-msg">No participants accepted yet.</p>
                        }
                    </div>

                    <!-- Pending Requests Section -->
                    <div class="pending-requests-section">
                        <h4>Pending Requests ({{ event.pendingUsersList?.length || 0 }})</h4>
                        @if (event.pendingUsersList?.length) {
                        @for (user of event.pendingUsersList; track user.id) {
                        <div class="request-item">
                            <div class="user-info">
                                <img [src]="user.profileImage || 'assets/placeholder-user.png'" class="user-avatar">
                                <span>{{ user.name }} {{ user.surname }}</span>
                            </div>
                            <div class="request-actions">
                                <button class="accept-btn" (click)="acceptRequest(event, user)">Accept</button>
                                <button class="reject-btn" (click)="rejectRequest(event, user)">Reject</button>
                            </div>
                        </div>
                        }
                        } @else {
                        <p class="no-requests">No pending requests.</p>
                        }
                    </div>
                </div>
                }
            </div>
            }
            @empty {
            <div class="empty-state">No organized events found.</div>
            }
        </div>
        }

        @if (!loading && activeTab === 'JOINED') {
        <div class="events-grid">
            @for (event of joinedEvents; track event.id) {
            <div class="joined-event-item">
                <div class="joined-action-btns">
                    <button class="joined-action-btn joined-pin-btn" (click)="goToEvent(event); $event.stopPropagation()"
                        title="View on map">
                        <mat-icon>place</mat-icon>
                    </button>
                    <button class="joined-chat-btn" (click)="openChat(event); $event.stopPropagation()"
                        title="Open chat">
                        <mat-icon>chat</mat-icon>
                    </button>
                </div>
                <app-event-card [title]="event.title" [location]="event.city" [dateTime]="formatDateTime(event)"
                    [id]="event.id!" [isSaved]="!!event.isSaved" [savedCount]="event.savedCount"
                    [isParticipating]="!!event.isParticipating" [showDistance]="false" [showActions]="false"
                    (shareEvent)="openShare(event)" [showLocationPin]="false">
                </app-event-card>
            </div>
            }
            @empty {
            <div class="empty-state">You haven't joined any events yet.</div>
            }
        </div>
        }

        @if (!loading && activeTab === 'SAVED') {
        <div class="events-grid">
            @for (event of savedEvents; track event.id) {
            <app-event-card [title]="event.title" [location]="event.city" [dateTime]="formatDateTime(event)"
                [id]="event.id!" [isSaved]="true" [savedCount]="event.savedCount"
                [isParticipating]="!!event.isParticipating" [showDistance]="false" [showActions]="false"
                (shareEvent)="openShare(event)" (focusLocation)="goToEvent(event)" [showLocationPin]="true">
            </app-event-card>
            }
            @empty {
            <div class="empty-state">You haven't saved any events yet.</div>
            }
        </div>
        }
    </div>
</div>
@if (sharingEvent) {
<app-event-share-modal [event]="sharingEvent" (close)="sharingEvent = null"></app-event-share-modal>
}
}

@if (showChatModal && chatEvent) {
<event-chat-modal [event]="chatEvent" [currentUserId]="userId.toString()" (close)="closeChat()">
</event-chat-modal>
}
`;
  }
});

// angular:jit:style:src/components/my-events-modal/my-events-modal.css
var my_events_modal_default2;
var init_my_events_modal2 = __esm({
  "angular:jit:style:src/components/my-events-modal/my-events-modal.css"() {
    my_events_modal_default2 = '/* src/components/my-events-modal/my-events-modal.css */\n.backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: var(--modal-backdrop-color);\n  z-index: var(--z-backdrop);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n}\n.modal-container {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 90%;\n  max-width: 600px;\n  height: 80vh;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  z-index: var(--z-popup);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-shadow: var(--modal-shadow);\n  border: var(--modal-border);\n}\n.modal-header {\n  padding: 16px 24px;\n  background: transparent;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: var(--modal-header-border);\n}\n.yellow-title {\n  color: var(--color-accent) !important;\n}\n.back-arrow {\n  cursor: pointer;\n  color: var(--color-white);\n  font-size: 24px;\n  margin-right: 16px;\n  transition: color 0.2s;\n}\n.back-arrow:hover {\n  color: var(--color-accent);\n}\n.tabs {\n  display: flex;\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  gap: 0;\n}\n.tab-btn {\n  flex: 1;\n  background: none;\n  border: none;\n  color: #888;\n  font-size: 16px;\n  font-weight: 600;\n  padding: 10px 24px;\n  cursor: pointer;\n  position: relative;\n  text-align: center;\n  border-left: 1px solid rgba(255, 255, 255, 0.12);\n  transition: color 0.3s;\n}\n.tab-btn:first-child {\n  border-left: none;\n}\n.tab-btn.active {\n  color: #fbce4e;\n}\n.tab-btn.active::after {\n  content: "";\n  position: absolute;\n  bottom: -17px;\n  left: 0;\n  width: 100%;\n  height: 3px;\n  background: #fbce4e;\n  border-radius: 3px 3px 0 0;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.modal-content {\n  flex: 1;\n  overflow-y: auto;\n  padding: 24px;\n}\n.events-list {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.organized-event-item {\n  background-color: var(--color-gray);\n  border-radius: var(--radius-md);\n  padding: 12px var(--spacing-md);\n  border: none;\n  color: var(--color-white);\n}\n.event-summary {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.event-actions {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n}\n.icon-btn.chat {\n  background: rgba(252, 195, 36, 0.14);\n  color: var(--color-accent);\n  border: 1px solid rgba(252, 195, 36, 0.3);\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n}\n.icon-btn.chat:hover {\n  background: rgba(252, 195, 36, 0.3);\n  color: #0b0b0b;\n}\n.event-info {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-xs);\n}\n.icon-btn.danger {\n  background: rgba(234, 67, 53, 0.1);\n  color: var(--color-danger);\n  border: 1px solid rgba(234, 67, 53, 0.2);\n  width: 36px;\n  height: 36px;\n  border-radius: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s;\n}\n.icon-btn.danger:hover {\n  background: var(--color-danger);\n  color: white;\n}\n.icon-btn.danger mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.event-info h3 {\n  margin: 0;\n  font-size: 14px;\n  font-weight: var(--font-weight-medium);\n  color: var(--color-white);\n}\n.event-location {\n  display: block;\n  margin: 0;\n  font-size: 12px;\n  color: var(--color-accent);\n  font-weight: var(--font-weight-medium);\n}\n.event-date {\n  display: block;\n  margin: 0;\n  font-size: 10px;\n  color: #888888;\n}\n.requests-badge {\n  display: inline-block;\n  background: var(--color-accent);\n  color: #000;\n  font-size: 10px;\n  font-weight: bold;\n  padding: 2px 8px;\n  border-radius: 12px;\n  cursor: pointer;\n  align-self: flex-start;\n  margin-top: 4px;\n}\n.icon-btn {\n  width: 32px;\n  height: 32px;\n  border-radius: var(--radius-full);\n  background-color: var(--color-bit-gray);\n  border: none;\n  color: var(--color-light-gray);\n  padding: 0;\n  cursor: pointer;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  transition: background-color 0.2s;\n}\n.icon-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.icon-btn:hover {\n  background-color: #555555;\n  color: var(--color-white);\n}\n.requests-panel {\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\n  animation: slideDown 0.3s ease-out;\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.requests-panel h4 {\n  margin: 0 0 12px 0;\n  color: #ddd;\n  font-size: 14px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.request-item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 0;\n}\n.user-info {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  color: #fff;\n}\n.user-avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  object-fit: cover;\n  background: #444;\n}\n.request-actions {\n  display: flex;\n  gap: 8px;\n}\n.accept-btn,\n.reject-btn {\n  border: none;\n  padding: 6px 12px;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.accept-btn {\n  background: #4caf50;\n  color: white;\n}\n.reject-btn {\n  background: #f44336;\n  color: white;\n}\n.no-requests {\n  color: #888;\n  font-size: 14px;\n  font-style: italic;\n}\n.event-overview-section {\n  margin-bottom: 24px;\n  padding-bottom: 24px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n}\n.pending-requests-section h4,\n.event-overview-section h4 {\n  margin: 0 0 16px 0;\n  color: #fbce4e;\n  font-size: 14px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: 700;\n}\n.stats-card {\n  display: flex;\n  gap: 16px;\n  margin-bottom: 20px;\n  background: rgba(255, 255, 255, 0.03);\n  padding: 16px;\n  border-radius: 12px;\n}\n.stat-item {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.stat-label {\n  color: #888;\n  font-size: 12px;\n  text-transform: uppercase;\n}\n.stat-value {\n  color: #fff;\n  font-size: 18px;\n  font-weight: 700;\n}\n.section-subtitle {\n  color: #ddd;\n  font-size: 14px;\n  margin: 0 0 12px 0;\n  font-weight: 600;\n}\n.participants-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n  gap: 10px;\n}\n.participant-chip {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: rgba(255, 255, 255, 0.05);\n  padding: 6px 10px;\n  border-radius: 20px;\n  border: 1px solid rgba(255, 255, 255, 0.05);\n}\n.participant-avatar {\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.participant-name {\n  color: #eee;\n  font-size: 12px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  flex: 1;\n  min-width: 0;\n}\n.participant-remove-btn {\n  margin-left: auto;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  border: 1px solid rgba(244, 67, 54, 0.3);\n  background: rgba(244, 67, 54, 0.15);\n  color: #f44336;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.participant-remove-btn mat-icon {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.participant-remove-btn:hover {\n  background: #f44336;\n  color: #fff;\n}\n.no-data-msg {\n  color: #888;\n  font-size: 13px;\n  font-style: italic;\n}\n.events-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n  gap: 16px;\n}\n.joined-event-item {\n  position: relative;\n}\n.joined-action-btns {\n  position: absolute;\n  top: 50%;\n  right: 12px;\n  transform: translateY(-50%);\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  z-index: 2;\n}\n.joined-action-btn {\n  width: 32px;\n  height: 32px;\n  border-radius: var(--radius-full);\n  background-color: var(--color-bit-gray);\n  border: none;\n  color: var(--color-light-gray);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: background-color 0.2s, transform 0.1s ease;\n}\n.joined-action-btn:hover {\n  background-color: #555555;\n}\n.joined-action-btn:active {\n  transform: scale(0.9);\n}\n.joined-action-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--color-light-gray);\n}\n.joined-chat-btn {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid rgba(252, 195, 36, 0.3);\n  background: rgba(252, 195, 36, 0.14);\n  color: var(--color-accent);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    background 0.2s,\n    color 0.2s,\n    border-color 0.2s;\n}\n.joined-chat-btn:hover {\n  background: rgba(252, 195, 36, 0.3);\n  color: #0b0b0b;\n}\n.joined-chat-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.empty-state {\n  text-align: center;\n  color: #888;\n  margin-top: 40px;\n}\n.modal-content::-webkit-scrollbar {\n  width: 8px;\n}\n.modal-content::-webkit-scrollbar-track {\n  background: #1a1a1a;\n  border-radius: 4px;\n}\n.modal-content::-webkit-scrollbar-thumb {\n  background: #333;\n  border-radius: 4px;\n}\n.modal-content::-webkit-scrollbar-thumb:hover {\n  background: #444;\n}\n@media (max-width: 768px) {\n  .backdrop {\n    -webkit-backdrop-filter: none;\n    backdrop-filter: none;\n  }\n  .modal-container {\n    position: fixed;\n    top: 0;\n    left: 0;\n    transform: none;\n    width: 100%;\n    max-width: 100%;\n    height: 100%;\n    max-height: 100vh;\n    border-radius: 0;\n    border: none;\n  }\n  .modal-header {\n    height: 70px;\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 24px;\n    border-bottom: var(--modal-header-border);\n    margin-bottom: 0;\n  }\n  .title-wrap {\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    margin: 0;\n    display: flex !important;\n    align-items: center;\n    justify-content: center;\n    pointer-events: none;\n    z-index: 5;\n  }\n  .modal-header h2 {\n    font-size: 24px !important;\n    color: var(--color-accent) !important;\n    text-align: center;\n    margin: 0 !important;\n    width: auto !important;\n    height: 100% !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    line-height: normal !important;\n  }\n  .back-arrow {\n    position: absolute;\n    left: 24px;\n    font-size: 24px;\n    cursor: pointer;\n    color: var(--color-white);\n    display: flex !important;\n    align-items: center;\n    justify-content: center;\n    z-index: 10;\n    height: 100%;\n    top: 0;\n  }\n  .modal-content {\n    padding: 16px;\n  }\n  .has-expanded-requests .organized-event-item:not(.expanded) {\n    display: none;\n  }\n  .has-expanded-requests .organized-event-item.expanded {\n    background: transparent !important;\n    padding: 0 !important;\n    border: none !important;\n  }\n  .has-expanded-requests .organized-event-item.expanded .event-summary {\n    display: none !important;\n  }\n  .has-expanded-requests .organized-event-item.expanded .requests-panel {\n    margin-top: 0 !important;\n    border-top: none !important;\n    padding-top: 0 !important;\n  }\n}\n.mobile-tabs {\n  display: none;\n  justify-content: space-around;\n  background: rgba(0, 0, 0, 0.3);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  padding: 8px 0;\n}\n.mobile-tab-btn {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 4px;\n  background: none;\n  border: none;\n  color: #888;\n  font-size: 11px;\n  cursor: pointer;\n  padding: 8px 0;\n  transition: color 0.2s;\n}\n.mobile-tab-btn mat-icon {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.mobile-tab-btn.active {\n  color: var(--color-accent);\n}\n.mobile-tab-btn.active mat-icon {\n  color: var(--color-accent);\n}\n@media (max-width: 768px) {\n  .mobile-tabs {\n    display: flex !important;\n  }\n}\n/*# sourceMappingURL=my-events-modal.css.map */\n';
  }
});

// angular:jit:template:src/components/event-chat-modal/event-chat-modal.html
var event_chat_modal_default;
var init_event_chat_modal = __esm({
  "angular:jit:template:src/components/event-chat-modal/event-chat-modal.html"() {
    event_chat_modal_default = `<div class="chat-backdrop" (click)="onClose()">
  <div class="chat-container" (click)="$event.stopPropagation()">
    <div class="chat-header">
      <div class="header-left">
        <mat-icon (click)="onClose()" class="back-arrow">arrow_back</mat-icon>
        <div class="header-text">
          <span class="title">Event Chat</span>
          <span class="subtitle">{{ event.title }}</span>
        </div>
      </div>
      <button class="close-btn" (click)="onClose()" aria-label="Close chat">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <div class="chat-body">
      <div class="chat-left">
        <!-- Single Pinned Item Bar -->
        @if (pinnedItem) {
        <div class="pinned-bar" (click)="scrollToItem(pinnedId!, pinnedType!)">
          <mat-icon class="pin-icon">push_pin</mat-icon>
          <div class="pinned-content">
            <span class="pinned-sender">{{ getPinnedSenderName() }}</span>
            <span class="pinned-text">{{ getPinnedDisplayText() }}</span>
          </div>
          <button class="unpin-btn" *ngIf="isOrganizer"
            (click)="togglePin(pinnedItem, pinnedType!); $event.stopPropagation()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        }
        <div class="messages" #messagesContainer (click)="closePinMenu()">
          <div class="info-message" *ngFor="let info of infoMessages" [attr.id]="info.anchorId">
            <div class="info-label">{{ info.label }}</div>
            <div class="info-content">{{ info.content }}</div>
            <a *ngIf="info.link" class="info-link" [href]="info.link" target="_blank" rel="noopener">Open link</a>
          </div>
          <div class="timeline-item" *ngFor="let item of timelineItems">
            @if (item.type === 'message' && item.message) {
            <div class="message" [attr.id]="getItemAnchorId(item.message.id, 'message')"
              [class.mine]="currentUserId && item.message.senderId.toString() === currentUserId"
              [class.pin-enabled]="isOrganizer" (click)="openPinMenu(item.message, 'message', $event)">
              <div class="avatar">
                <img *ngIf="item.message.senderImage" [src]="item.message.senderImage" alt="Avatar">
                <div *ngIf="!item.message.senderImage" class="placeholder">
                  {{ item.message.senderName.slice(0, 1) || '?' }}
                </div>
              </div>
              <div class="content">
                <div class="meta">
                  <span class="name">{{ item.message.senderName }}</span>
                  <span class="time">{{ formatTimestamp(item.message.createdAt) }}</span>
                  @if (isOrganizer && activePinId === item.message.id && activePinType === 'message') {
                  <div class="pin-menu" (click)="$event.stopPropagation()">
                    <button class="pin-menu-btn" type="button"
                      (click)="togglePinFromMenu(item.message, 'message', $event)"
                      [class.active]="isPinned(item.message.id, 'message')"
                      [class.unpin]="isPinned(item.message.id, 'message')"
                      [attr.aria-label]="isPinned(item.message.id, 'message') ? 'Unpin' : 'Pin message'">
                      <mat-icon>push_pin</mat-icon>
                    </button>
                  </div>
                  }
                </div>
                <div class="text">{{ item.message.content }}</div>
              </div>
            </div>
            }
            @if (item.type === 'poll' && item.poll) {
            <div class="poll-message-card" [attr.id]="getItemAnchorId(item.poll.id, 'poll')"
              [class.pin-enabled]="isOrganizer" (click)="openPinMenu(item.poll, 'poll', $event)">
              <div class="poll-message-header">
                <div class="header-main">
                  <span class="poll-tag">Sondaggio</span>
                  <span class="time">{{ formatTimestamp(item.poll.createdAt) }}</span>
                </div>
                @if (isOrganizer && activePinId === item.poll.id && activePinType === 'poll') {
                <div class="pin-menu" (click)="$event.stopPropagation()">
                  <button class="pin-menu-btn" type="button" (click)="togglePinFromMenu(item.poll, 'poll', $event)"
                    [class.active]="isPinned(item.poll.id, 'poll')" [class.unpin]="isPinned(item.poll.id, 'poll')"
                    [attr.aria-label]="isPinned(item.poll.id, 'poll') ? 'Unpin' : 'Pin poll'">
                    <mat-icon>push_pin</mat-icon>
                  </button>
                </div>
                }
              </div>
              <div class="poll-message-question">{{ item.poll.question }}</div>
              <div class="poll-bars">
                <div class="poll-bar-row" *ngFor="let option of item.poll.options"
                  [class.selected]="pollSelections[item.poll.id]?.has(option.id)" [class.closed]="item.poll.closed"
                  (click)="toggleVote(item.poll, option.id)">
                  <div class="poll-bar-label">
                    <span>{{ option.text }}</span>
                    <span class="poll-bar-count">{{ getPollOptionCount(option) }}</span>
                  </div>
                  <div class="poll-bar-track">
                    <div class="poll-bar-fill" [style.width]="getPollBarWidth(item.poll, option)"></div>
                  </div>
                </div>
              </div>
              <div class="poll-actions">
                <button *ngIf="isOrganizer" class="pill ghost" (click)="closePoll(item.poll)"
                  [disabled]="item.poll.closed">
                  Chiudi sondaggio
                </button>
              </div>
              <div class="poll-total">Totale voti: {{ getPollTotalVotes(item.poll) }}</div>
            </div>
            }
          </div>
          <div *ngIf="timelineItems.length === 0" class="empty-state">
            Nessun messaggio ancora.
          </div>
        </div>

        <div class="mute-banner" *ngIf="isMuted">
          Sei stato mutato: puoi leggere ma non inviare messaggi.
        </div>

        <div class="message-input">
          <input [(ngModel)]="messageText" placeholder="Scrivi un messaggio..." (input)="messageError = ''"
            [disabled]="isMuted" (keydown.enter)="sendMessage()">
          <button *ngIf="currentUserId" class="add-btn" (click)="openPollPopup()" [disabled]="isMuted">
            <mat-icon>add</mat-icon>
          </button>
          <button class="send-btn" (click)="sendMessage()" [disabled]="isMuted || !messageText.trim()">
            <mat-icon>send</mat-icon>
          </button>
        </div>
        <div class="message-error" *ngIf="messageError">{{ messageError }}</div>

      </div>
    </div>

    @if (showPollPopup) {
    <div class="poll-popup-backdrop" (click)="closePollPopup()">
      <div class="poll-popup" (click)="$event.stopPropagation()">
        <div class="poll-popup-header">
          <span>Crea sondaggio</span>
          <button class="icon-btn" (click)="closePollPopup()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="poll-create">
          <input [(ngModel)]="pollQuestion" placeholder="Domanda del sondaggio" class="poll-question-input">

          <div class="poll-options-list">
            <div class="poll-option-row" *ngFor="let option of pollOptions; let i = index; trackBy: trackByIndex">
              <input [(ngModel)]="pollOptions[i]" [placeholder]="'Opzione ' + (i + 1)">
              <button class="remove-option-btn" (click)="removePollOption(i)" *ngIf="pollOptions.length > 2">
                <mat-icon>remove_circle_outline</mat-icon>
              </button>
            </div>
          </div>

          <button class="add-option-pill" (click)="addPollOption()" *ngIf="pollOptions.length < 5">
            <mat-icon>add</mat-icon>
            Aggiungi opzione
          </button>

          <div class="poll-error" *ngIf="pollError">{{ pollError }}</div>
          <button class="pill create-poll-btn" (click)="createPoll()">Crea sondaggio</button>
        </div>
      </div>
    </div>
    }
  </div>
</div>`;
  }
});

// angular:jit:style:src/components/event-chat-modal/event-chat-modal.css
var event_chat_modal_default2;
var init_event_chat_modal2 = __esm({
  "angular:jit:style:src/components/event-chat-modal/event-chat-modal.css"() {
    event_chat_modal_default2 = '/* src/components/event-chat-modal/event-chat-modal.css */\n.chat-backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2000;\n  padding: 16px;\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n}\n.chat-container {\n  width: 100%;\n  max-width: 760px;\n  max-height: 90vh;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  box-shadow: var(--modal-shadow);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  border: var(--modal-border);\n  color: #f5f5f5;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n@media (max-width: 768px) {\n  .chat-backdrop {\n    padding: 0;\n  }\n  .chat-container {\n    width: 100vw;\n    height: 100vh;\n    max-height: 100vh;\n    border-radius: 0;\n  }\n  .mobile-only {\n    display: inline-flex;\n  }\n  .close-btn {\n    display: none;\n  }\n  .title {\n    color: var(--color-accent);\n  }\n  .chat-header {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    position: relative;\n    padding: 16px;\n  }\n  .header-left {\n    width: 100%;\n    justify-content: center;\n    gap: 0;\n  }\n  .back-arrow {\n    position: absolute;\n    left: 16px;\n    margin-right: 0;\n  }\n  .header-text {\n    align-items: center;\n    text-align: center;\n  }\n}\n.chat-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: var(--modal-header-border);\n}\n.header-left {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.header-text {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.title {\n  font-weight: 700;\n  font-size: 18px;\n  color: #facc15;\n}\n.subtitle {\n  color: #bdbdbd;\n  font-size: 14px;\n}\n.icon-btn {\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  color: #f0f0f0;\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  display: grid;\n  place-items: center;\n  transition: background-color 0.15s ease, border-color 0.15s ease;\n}\n.icon-btn:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.2);\n}\n.back-arrow {\n  cursor: pointer;\n  color: #fff;\n  font-size: 24px;\n  margin-right: 4px;\n  transition: color 0.2s;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.back-arrow:hover {\n  color: var(--color-accent);\n}\n.chat-body {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n  padding: 16px;\n  overflow: hidden;\n  flex: 1;\n  min-height: 0;\n  justify-content: center;\n}\n.chat-left {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-height: 0;\n  height: 100%;\n}\n.pinned-toggle {\n  width: 100%;\n  background: rgba(255, 255, 255, 0.04);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  color: #f3f3f3;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 12px;\n  cursor: pointer;\n  border-radius: 12px;\n}\n.pinned-title {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  font-weight: 600;\n  font-size: 14px;\n}\n.pinned-toggle .chevron {\n  transition: transform 0.2s ease;\n}\n.pinned-toggle .chevron.open {\n  transform: rotate(180deg);\n}\n.pinned-bar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  background: rgba(252, 195, 36, 0.12);\n  border: 1px solid rgba(252, 195, 36, 0.25);\n  border-radius: 12px;\n  padding: 10px 12px;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n.pinned-bar:hover {\n  background: rgba(252, 195, 36, 0.18);\n}\n.pinned-bar .pin-icon {\n  color: var(--color-accent);\n  font-size: 20px;\n  flex-shrink: 0;\n}\n.pinned-content {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  flex: 1;\n  min-width: 0;\n}\n.pinned-sender {\n  font-size: 12px;\n  font-weight: 700;\n  color: var(--color-accent);\n}\n.pinned-text {\n  font-size: 13px;\n  color: #e6e6e6;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.unpin-btn {\n  background: transparent;\n  border: none;\n  color: #888;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.unpin-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n}\n.unpin-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.pinned-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  margin-top: 8px;\n  margin-bottom: 4px;\n}\n.pinned-item {\n  background: rgba(255, 255, 255, 0.04);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  color: #f0f0f0;\n  border-radius: 12px;\n  padding: 8px 10px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  text-align: left;\n  cursor: pointer;\n}\n.pinned-item:hover {\n  border-color: rgba(255, 255, 255, 0.2);\n  background: rgba(255, 255, 255, 0.08);\n}\n.pin-label {\n  font-size: 11px;\n  letter-spacing: 0.2px;\n  text-transform: uppercase;\n  color: var(--color-accent);\n}\n.pin-preview {\n  font-size: 13px;\n  color: #e6e6e6;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.messages {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 16px;\n  padding: 16px;\n  overflow-y: auto;\n  scroll-behavior: smooth;\n  flex: 1;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.messages::-webkit-scrollbar {\n  display: none;\n}\n.timeline-item {\n  margin-bottom: 14px;\n}\n.message {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 14px;\n  align-items: flex-start;\n  position: relative;\n}\n.message.pin-enabled {\n  cursor: pointer;\n}\n.message.mine {\n  flex-direction: row-reverse;\n}\n.message.mine .content {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n.message.mine .meta {\n  justify-content: flex-end;\n}\n.message.mine .text {\n  text-align: right;\n}\n.avatar img,\n.avatar .placeholder {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.1);\n  font-weight: 600;\n  pointer-events: none;\n}\n.content {\n  flex: 1;\n  max-width: 70%;\n  position: relative;\n}\n.meta {\n  display: flex;\n  gap: 8px;\n  font-size: 12px;\n  color: #9a9a9a;\n  margin-bottom: 4px;\n  align-items: center;\n}\n.name {\n  font-weight: 600;\n  color: #f2f2f2;\n}\n.text {\n  background: rgba(255, 255, 255, 0.08);\n  border-radius: 12px;\n  padding: 10px 12px;\n  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);\n  border: 1px solid rgba(255, 255, 255, 0.06);\n  display: inline-block;\n  width: auto;\n  max-width: 100%;\n}\n.message.mine .text {\n  background: rgba(252, 195, 36, 0.18);\n  border-color: rgba(252, 195, 36, 0.35);\n  color: #fdf7e0;\n}\n.pin-menu {\n  position: static;\n  z-index: 1;\n  display: inline-flex;\n  align-items: center;\n  margin-left: 6px;\n}\n.message.mine .pin-menu {\n  margin-right: 6px;\n  margin-left: 0;\n}\n.pin-menu-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 30px;\n  border-radius: 0;\n  border: none;\n  background: transparent;\n  color: #ffffff;\n  cursor: pointer;\n  position: relative;\n}\n.pin-menu-btn.active {\n  color: var(--color-accent);\n  border-color: rgba(252, 195, 36, 0.5);\n}\n.pin-menu-btn mat-icon {\n  font-size: 22px;\n}\n.pin-menu-btn.unpin::after {\n  content: "";\n  position: absolute;\n  width: 18px;\n  height: 3px;\n  background: #000000;\n  border-radius: 2px;\n  transform: rotate(-35deg);\n}\n.pin-menu-btn.unpin {\n  color: #ffffff;\n}\n.info-message {\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  background: rgba(255, 255, 255, 0.04);\n  padding: 10px 12px;\n  margin-bottom: 10px;\n}\n.info-label {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.3px;\n  color: var(--color-accent);\n  margin-bottom: 4px;\n  font-weight: 700;\n}\n.info-content {\n  font-size: 13px;\n  color: #e6e6e6;\n  white-space: pre-wrap;\n}\n.info-link {\n  display: inline-flex;\n  margin-top: 6px;\n  font-size: 12px;\n  color: var(--color-accent);\n  text-decoration: none;\n}\n.info-link:hover {\n  text-decoration: underline;\n}\n.poll-message-card {\n  border-radius: 14px;\n  padding: 12px;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  transition: background-color 0.2s, border-color 0.2s;\n  position: relative;\n}\n.poll-message-card.pin-enabled {\n  cursor: pointer;\n}\n.poll-message-card.pin-enabled:hover {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: rgba(252, 195, 36, 0.4);\n}\n.poll-message-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  font-size: 12px;\n  color: #b8b8b8;\n  margin-bottom: 8px;\n}\n.poll-message-header .header-main {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.poll-tag {\n  background: rgba(252, 195, 36, 0.2);\n  color: var(--color-accent);\n  padding: 2px 8px;\n  border-radius: 999px;\n  font-weight: 600;\n  font-size: 11px;\n}\n.poll-message-question {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--color-accent);\n  margin-bottom: 12px;\n}\n.poll-bars {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.poll-bar-row {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 10px;\n  border-radius: 10px;\n  cursor: pointer;\n  transition: background-color 0.2s ease, border-color 0.2s ease;\n  border: 1px solid transparent;\n  background: rgba(255, 255, 255, 0.04);\n}\n.poll-bar-row:hover:not(.closed) {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.1);\n}\n.poll-bar-row.selected {\n  background: rgba(252, 195, 36, 0.12);\n  border-color: rgba(252, 195, 36, 0.3);\n}\n.poll-bar-row.closed {\n  cursor: default;\n  opacity: 0.8;\n}\n.poll-bar-label {\n  display: flex;\n  justify-content: space-between;\n  font-size: 12px;\n  color: #d8d8d8;\n}\n.poll-bar-track {\n  height: 8px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.08);\n  overflow: hidden;\n}\n.poll-bar-fill {\n  height: 100%;\n  background: var(--color-accent);\n  box-shadow: 0 4px 10px rgba(252, 195, 36, 0.3);\n}\n.poll-actions {\n  display: flex;\n  gap: 8px;\n  margin-top: 14px;\n}\n.poll-total {\n  margin-top: 10px;\n  font-size: 11px;\n  color: #b0b0b0;\n}\n.empty-state {\n  color: #b3b3b3;\n  font-size: 14px;\n  text-align: center;\n  padding: 16px 0;\n}\n.mute-banner {\n  background: rgba(255, 96, 96, 0.15);\n  color: #ffb3b3;\n  padding: 10px 12px;\n  border-radius: 12px;\n  font-size: 13px;\n  border: 1px solid rgba(255, 96, 96, 0.3);\n}\n.message-input {\n  display: flex;\n  gap: 8px;\n}\n.message-error {\n  color: #ffb3b3;\n  font-size: 12px;\n  margin-top: 4px;\n}\n.message-input input {\n  flex: 1;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  padding: 10px 12px;\n  background: rgba(255, 255, 255, 0.04);\n  color: #f4f4f4;\n}\n.send-btn {\n  background: var(--color-accent);\n  color: #ffffff;\n  border: none;\n  border-radius: 12px;\n  padding: 0 16px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  box-shadow: 0 10px 20px rgba(252, 195, 36, 0.25);\n}\n.add-btn {\n  background: rgba(255, 255, 255, 0.08);\n  color: #f5f5f5;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 12px;\n  width: 42px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.add-btn:hover {\n  background: rgba(255, 255, 255, 0.14);\n}\n.poll-create .poll-question-input {\n  width: 100%;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  padding: 10px 12px;\n  margin-bottom: 20px;\n  background: rgba(255, 255, 255, 0.04);\n  color: #f4f4f4;\n  font-weight: 600;\n}\n.poll-options-list {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.poll-option-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.poll-option-row input {\n  flex: 1;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  padding: 8px 12px;\n  background: rgba(255, 255, 255, 0.04);\n  color: #f4f4f4;\n  font-size: 14px;\n}\n.remove-option-btn {\n  background: transparent;\n  border: none;\n  color: #ef4444;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 4px;\n  opacity: 0.7;\n  transition: opacity 0.2s;\n}\n.remove-option-btn:hover {\n  opacity: 1;\n}\n.add-option-pill {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  background: rgba(252, 195, 36, 0.1);\n  color: var(--color-accent);\n  border: 1px dashed var(--color-accent);\n  border-radius: 12px;\n  padding: 8px 16px;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 600;\n  width: 100%;\n  justify-content: center;\n  margin-bottom: 20px;\n  transition: background-color 0.2s;\n}\n.add-option-pill:hover {\n  background: rgba(252, 195, 36, 0.15);\n}\n.create-poll-btn {\n  width: 100%;\n  padding: 12px !important;\n  font-weight: 700 !important;\n  font-size: 15px !important;\n  margin-top: 10px;\n}\n.pill {\n  border-radius: 999px;\n  border: none;\n  background: var(--color-accent);\n  color: #ffffff;\n  padding: 8px 14px;\n  cursor: pointer;\n  font-size: 12px;\n  box-shadow: 0 8px 18px rgba(252, 195, 36, 0.18);\n}\n.pill.ghost {\n  background: transparent;\n  color: #f5f5f5;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: none;\n}\n.pill.danger {\n  background: #d43d3d;\n  color: #fff;\n  box-shadow: none;\n}\n.poll-popup-backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 60;\n}\n.poll-popup {\n  width: min(460px, 92vw);\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  border: var(--modal-border);\n  padding: 16px;\n  box-shadow: var(--modal-shadow);\n}\n.poll-popup-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 16px;\n}\n.poll-popup-header span {\n  font-weight: 700;\n  color: var(--color-accent);\n  font-size: 18px;\n}\n.poll-error {\n  color: #ffb3b3;\n  font-size: 12px;\n  margin-bottom: 8px;\n}\n.mobile-only {\n  display: none;\n}\n.avatar {\n  flex: 0 0 auto;\n  width: 36px;\n  height: 36px;\n  flex-shrink: 0;\n  position: relative;\n  z-index: 1;\n  display: block;\n}\n/*# sourceMappingURL=event-chat-modal.css.map */\n';
  }
});

// src/services/chat.service.ts
var ChatService;
var init_chat_service = __esm({
  "src/services/chat.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    ChatService = class ChatService2 {
      http;
      baseUrl = "http://localhost:8080/api/events";
      moderationUrl = "http://localhost:8080/api/moderation";
      constructor(http) {
        this.http = http;
      }
      getMessages(eventId, userId, limit = 100) {
        const params = new URLSearchParams();
        if (userId !== void 0 && userId !== null) {
          params.set("userId", String(userId));
        }
        params.set("limit", String(limit));
        return this.http.get(`${this.baseUrl}/${eventId}/chat/messages?${params.toString()}`);
      }
      sendMessage(eventId, userId, content) {
        return this.http.post(`${this.baseUrl}/${eventId}/chat/messages?userId=${userId}`, { content });
      }
      connect(eventId, userId, onEvent) {
        const source = new EventSource(`${this.baseUrl}/${eventId}/chat/stream?userId=${userId}`);
        const handler = (type) => (event) => {
          onEvent(type, JSON.parse(event.data));
        };
        source.addEventListener("message", handler("message"));
        source.addEventListener("poll", handler("poll"));
        source.addEventListener("poll-vote", handler("poll-vote"));
        source.addEventListener("poll-close", handler("poll-close"));
        source.addEventListener("mute", handler("mute"));
        return source;
      }
      getMuteStatus(eventId, userId) {
        return this.http.get(`${this.baseUrl}/${eventId}/chat/mute-status?userId=${userId}`);
      }
      getMutes(eventId, userId) {
        return this.http.get(`${this.baseUrl}/${eventId}/chat/mutes?userId=${userId}`);
      }
      muteUser(eventId, userId, targetUserId, reason) {
        return this.http.post(`${this.baseUrl}/${eventId}/chat/mutes?userId=${userId}`, { targetUserId, reason });
      }
      unmuteUser(eventId, userId, targetUserId) {
        return this.http.delete(`${this.baseUrl}/${eventId}/chat/mutes/${targetUserId}?userId=${userId}`);
      }
      getPolls(eventId, userId) {
        return this.http.get(`${this.baseUrl}/${eventId}/chat/polls?userId=${userId}`);
      }
      createPoll(eventId, userId, question, options, endsAt) {
        return this.http.post(`${this.baseUrl}/${eventId}/chat/polls/open?userId=${userId}`, { question, options, endsAt });
      }
      votePoll(eventId, pollId, userId, optionIds) {
        return this.http.post(`${this.baseUrl}/${eventId}/chat/polls/${pollId}/votes?userId=${userId}`, { optionIds });
      }
      closePoll(eventId, pollId, userId) {
        return this.http.post(`${this.baseUrl}/${eventId}/chat/polls/${pollId}/close?userId=${userId}`, {});
      }
      getBannedWords() {
        return this.http.get(`${this.moderationUrl}/banned-words`);
      }
      checkMessage(content) {
        return this.http.post(`${this.moderationUrl}/check`, { content });
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    ChatService = __decorate([
      Injectable({ providedIn: "root" })
    ], ChatService);
  }
});

// src/components/event-chat-modal/event-chat-modal.ts
var EventChatModalComponent;
var init_event_chat_modal3 = __esm({
  "src/components/event-chat-modal/event-chat-modal.ts"() {
    "use strict";
    init_tslib_es6();
    init_event_chat_modal();
    init_event_chat_modal2();
    init_core();
    init_common();
    init_forms();
    init_icon();
    init_chat_service();
    EventChatModalComponent = class EventChatModalComponent2 {
      chatService;
      event;
      currentUserId = null;
      close = new EventEmitter();
      messagesContainer;
      messages = [];
      polls = [];
      mutes = [];
      mutedUserIds = /* @__PURE__ */ new Set();
      isMuted = false;
      isOrganizer = false;
      messageText = "";
      pollQuestion = "";
      pollOptions = ["", "", ""];
      pollSelections = {};
      pollError = "";
      showPollPopup = false;
      pinnedId = null;
      pinnedType = null;
      pinnedItem = null;
      activePinId = null;
      activePinType = null;
      bannedPatterns = [];
      bannedRaw = [];
      messageError = "";
      timelineItems = [];
      infoMessages = [];
      eventSource = null;
      constructor(chatService) {
        this.chatService = chatService;
      }
      ngOnInit() {
        this.initializeChat();
      }
      ngOnChanges(changes) {
        if (changes["event"] || changes["currentUserId"]) {
          this.initializeChat();
        }
      }
      ngOnDestroy() {
        this.persistMessages();
        this.eventSource?.close();
      }
      onClose() {
        this.close.emit();
      }
      openPollPopup() {
        this.pollQuestion = "";
        this.pollOptions = ["", "", ""];
        this.pollError = "";
        this.showPollPopup = true;
      }
      closePollPopup() {
        this.showPollPopup = false;
        this.pollError = "";
      }
      addPollOption() {
        if (this.pollOptions.length < 5) {
          this.pollOptions.push("");
        }
      }
      removePollOption(index) {
        if (this.pollOptions.length > 2) {
          this.pollOptions.splice(index, 1);
        }
      }
      trackByIndex(index, obj) {
        return index;
      }
      sendMessage() {
        if (!this.currentUserId || !this.messageText.trim())
          return;
        const content = this.messageText.trim();
        this.messageText = "";
        if (this.isBannedMessage(content)) {
          this.messageError = "Messaggio non consentito.";
          return;
        }
        this.messageError = "";
        this.chatService.checkMessage(content).subscribe({
          next: (res) => {
            if (res?.banned) {
              this.messageError = "Messaggio non consentito.";
              return;
            }
            this.chatService.sendMessage(this.event.id, this.currentUserId, content).subscribe({
              next: (message) => {
                this.addMessage(message);
              },
              error: (err) => {
                const apiError = err?.error?.data?.content || err?.error?.error;
                if (apiError) {
                  this.messageError = apiError;
                }
                console.error("Error sending message", err);
              }
            });
          },
          error: (err) => {
            this.messageError = "Messaggio non consentito.";
            console.error("Error checking message", err);
          }
        });
      }
      createPoll() {
        if (!this.currentUserId || !this.pollQuestion.trim())
          return;
        const options = this.pollOptions.map((line) => line.trim()).filter(Boolean);
        if (options.length < 2) {
          this.pollError = "Inserisci almeno due opzioni.";
          return;
        }
        if (options.length > 5) {
          this.pollError = "Massimo 5 opzioni consentite.";
          return;
        }
        const futureDate = new Date(Date.now() + 1e3 * 60 * 60 * 24 * 365 * 10);
        const endsAtIso = futureDate.toISOString().split(".")[0];
        this.chatService.createPoll(this.event.id, this.currentUserId, this.pollQuestion.trim(), options, endsAtIso).subscribe({
          next: (poll) => {
            this.upsertPoll(poll);
            this.pollQuestion = "";
            this.pollOptions = ["", "", ""];
            this.showPollPopup = false;
            this.pollError = "";
            this.loadPolls();
          },
          error: (err) => {
            console.error("Error creating poll", err);
            this.pollError = "Errore nella creazione del sondaggio.";
          }
        });
      }
      toggleVote(poll, optionId) {
        if (!this.currentUserId || poll.closed)
          return;
        this.chatService.votePoll(this.event.id, poll.id, this.currentUserId, [optionId]).subscribe({
          next: (updated) => this.upsertPoll(updated),
          error: (err) => console.error("Error voting poll", err)
        });
      }
      closePoll(poll) {
        if (!this.currentUserId)
          return;
        this.chatService.closePoll(this.event.id, poll.id, this.currentUserId).subscribe({
          next: (updated) => this.upsertPoll(updated),
          error: (err) => console.error("Error closing poll", err)
        });
      }
      muteUser(user) {
        if (!this.currentUserId)
          return;
        this.chatService.muteUser(this.event.id, this.currentUserId, user.id).subscribe({
          next: (mute) => {
            this.mutes = [...this.mutes.filter((m) => m.userId !== mute.userId), mute];
            this.mutedUserIds.add(mute.userId);
          },
          error: (err) => console.error("Error muting user", err)
        });
      }
      unmuteUser(user) {
        if (!this.currentUserId)
          return;
        this.chatService.unmuteUser(this.event.id, this.currentUserId, user.id).subscribe({
          next: () => {
            this.mutes = this.mutes.filter((m) => m.userId !== user.id);
            this.mutedUserIds.delete(user.id);
          },
          error: (err) => console.error("Error unmuting user", err)
        });
      }
      isUserMuted(userId) {
        return this.mutedUserIds.has(userId);
      }
      getParticipants() {
        return this.event.acceptedUsersList || [];
      }
      formatTimestamp(value) {
        if (!value)
          return "";
        const date = new Date(value);
        return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
      }
      formatDateTime(value) {
        if (!value)
          return "";
        const date = new Date(value);
        return date.toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
      }
      getOptionVoters(option) {
        if (!option.voters || option.voters.length === 0)
          return "";
        return option.voters.map((voter) => voter.userName).join(", ");
      }
      rebuildTimelineItems() {
        const items = [];
        this.messages.forEach((message) => items.push({ type: "message", createdAt: message.createdAt, message }));
        this.polls.forEach((poll) => items.push({ type: "poll", createdAt: poll.createdAt, poll }));
        this.timelineItems = items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      getPollTotalVotes(poll) {
        return poll.options.reduce((sum, option) => sum + (option.voters?.length || 0), 0);
      }
      getPollOptionCount(option) {
        return option.voters?.length || 0;
      }
      getPollBarWidth(poll, option) {
        const total = this.getPollTotalVotes(poll);
        if (!total)
          return "0%";
        const count = this.getPollOptionCount(option);
        return `${Math.round(count / total * 100)}%`;
      }
      getPinnedSenderName() {
        if (!this.pinnedItem)
          return "";
        if (this.pinnedType === "poll")
          return "Sondaggio";
        return this.pinnedItem.senderName || "Utente";
      }
      getPinnedDisplayText() {
        if (!this.pinnedItem)
          return "";
        if (this.pinnedType === "poll")
          return this.pinnedItem.question;
        return this.pinnedItem.content;
      }
      isPinned(id, type) {
        return this.pinnedId === id && this.pinnedType === type;
      }
      openPinMenu(item, type, event) {
        if (!this.isOrganizer)
          return;
        event.stopPropagation();
        this.activePinId = item.id;
        this.activePinType = type;
      }
      closePinMenu() {
        this.activePinId = null;
        this.activePinType = null;
      }
      togglePinFromMenu(item, type, event) {
        event.stopPropagation();
        this.togglePin(item, type);
        this.activePinId = null;
        this.activePinType = null;
      }
      togglePin(item, type) {
        if (this.pinnedId === item.id && this.pinnedType === type) {
          this.pinnedId = null;
          this.pinnedType = null;
          this.pinnedItem = null;
        } else {
          this.pinnedId = item.id;
          this.pinnedType = type;
          this.pinnedItem = item;
        }
        this.persistPinnedItem();
      }
      scrollToItem(id, type) {
        this.scrollToAnchor(this.getItemAnchorId(id, type));
      }
      scrollToAnchor(anchorId) {
        const container = this.messagesContainer?.nativeElement;
        if (!container)
          return;
        const target = container.querySelector(`#${anchorId}`);
        if (!target)
          return;
        const containerTop = container.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        container.scrollTo({
          top: container.scrollTop + targetTop - containerTop - 12,
          behavior: "smooth"
        });
      }
      getItemAnchorId(id, type) {
        return `chat-${type}-${id}`;
      }
      getMessageAnchorId(id) {
        return this.getItemAnchorId(id, "message");
      }
      loadBannedWords() {
        this.chatService.getBannedWords().subscribe({
          next: (words) => this.buildBannedPatterns(words),
          error: (err) => console.error("Error loading banned words", err)
        });
      }
      loadData() {
        if (!this.currentUserId)
          return;
        this.chatService.getMessages(this.event.id).subscribe({
          next: (messages) => {
            if (messages.length === 0 && this.messages.length > 0) {
              return;
            }
            this.messages = messages;
            this.refreshPinnedItem();
            this.persistMessages();
            this.rebuildTimelineItems();
            this.scrollToBottom();
          },
          error: (err) => console.error("Error loading messages", err)
        });
        this.loadPolls();
        this.chatService.getMuteStatus(this.event.id, this.currentUserId).subscribe({
          next: (res) => this.isMuted = res.muted,
          error: (err) => console.error("Error loading mute status", err)
        });
        if (this.isOrganizer) {
          this.chatService.getMutes(this.event.id, this.currentUserId).subscribe({
            next: (mutes) => {
              this.mutes = mutes;
              this.mutedUserIds = new Set(mutes.map((m) => m.userId));
            },
            error: (err) => console.error("Error loading mutes", err)
          });
        }
      }
      connectStream() {
        if (!this.currentUserId)
          return;
        this.eventSource?.close();
        this.eventSource = this.chatService.connect(this.event.id, this.currentUserId, (type, payload) => {
          if (type === "message") {
            this.addMessage(payload);
          }
          if (type === "poll" || type === "poll-vote" || type === "poll-close") {
            this.upsertPoll(payload);
          }
          if (type === "mute") {
            const data = payload;
            if (data.muted) {
              this.mutedUserIds.add(data.userId);
            } else {
              this.mutedUserIds.delete(data.userId);
            }
            if (this.currentUserId && Number(this.currentUserId) === data.userId) {
              this.isMuted = data.muted;
            }
          }
        });
      }
      loadPolls() {
        if (!this.currentUserId)
          return;
        this.chatService.getPolls(this.event.id, this.currentUserId).subscribe({
          next: (polls) => {
            this.polls = polls;
            polls.forEach((poll) => this.syncPollSelections(poll));
            this.rebuildTimelineItems();
            this.scrollToBottom();
          },
          error: (err) => console.error("Error loading polls", err)
        });
      }
      toIsoLocal(input) {
        if (!input)
          return null;
        if (input.includes("T"))
          return input;
        const trimmed = input.trim();
        const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
        if (!match)
          return null;
        const [, dd, mm, yyyy, hh, min] = match;
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
      }
      upsertPoll(updated) {
        const existingIndex = this.polls.findIndex((p) => p.id === updated.id);
        const isNew = existingIndex < 0;
        if (!isNew) {
          const next = [...this.polls];
          next[existingIndex] = updated;
          this.polls = next;
        } else {
          this.polls = [updated, ...this.polls];
        }
        this.syncPollSelections(updated);
        this.rebuildTimelineItems();
        if (isNew) {
          this.scrollToBottom();
        }
      }
      syncPollSelections(poll) {
        if (!this.currentUserId)
          return;
        const selection = /* @__PURE__ */ new Set();
        poll.options.forEach((option) => {
          const hasVote = option.voters?.some((voter) => voter.userId === Number(this.currentUserId));
          if (hasVote) {
            selection.add(option.id);
          }
        });
        this.pollSelections[poll.id] = selection;
      }
      addMessage(message) {
        if (!this.messages.some((existing) => existing.id === message.id)) {
          this.messages = [...this.messages, message];
          this.refreshPinnedItem();
          this.persistMessages();
          this.rebuildTimelineItems();
          this.scrollToBottom();
        }
      }
      initializeChat() {
        if (!this.event)
          return;
        this.messages = this.getCachedMessages();
        this.loadPinnedItem();
        this.buildInfoMessages();
        this.rebuildTimelineItems();
        this.activePinId = null;
        this.activePinType = null;
        this.loadBannedWords();
        if (!this.currentUserId)
          return;
        this.isOrganizer = this.event.creatorId?.toString() === this.currentUserId;
        this.loadData();
        this.connectStream();
      }
      getCacheKeys() {
        if (!this.event?.id)
          return [];
        const keys = [`chat-cache:${this.event.id}`];
        if (this.currentUserId) {
          keys.push(`chat-cache:${this.event.id}:${this.currentUserId}`);
        }
        return keys;
      }
      getCachedMessages() {
        const keys = this.getCacheKeys();
        if (keys.length === 0)
          return [];
        const map = /* @__PURE__ */ new Map();
        for (const key of keys) {
          const raw = localStorage.getItem(key);
          if (!raw)
            continue;
          try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed))
              continue;
            parsed.forEach((message) => {
              if (message && typeof message.id === "number") {
                map.set(message.id, message);
              }
            });
          } catch {
            continue;
          }
        }
        return Array.from(map.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      persistMessages() {
        const keys = this.getCacheKeys();
        if (keys.length === 0)
          return;
        const payload = JSON.stringify(this.messages);
        keys.forEach((key) => localStorage.setItem(key, payload));
      }
      pinnedStorageKey() {
        if (!this.event?.id)
          return null;
        return `chat-pins:${this.event.id}`;
      }
      loadPinnedItem() {
        const key = this.pinnedStorageKey();
        if (!key)
          return;
        const raw = localStorage.getItem(key);
        if (!raw) {
          this.pinnedId = null;
          this.pinnedType = null;
          this.pinnedItem = null;
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.id === "number") {
            this.pinnedId = parsed.id;
            this.pinnedType = parsed.type;
            this.refreshPinnedItem();
          } else {
            this.pinnedId = null;
            this.pinnedType = null;
            this.pinnedItem = null;
          }
        } catch {
          this.pinnedId = null;
          this.pinnedType = null;
          this.pinnedItem = null;
        }
      }
      persistPinnedItem() {
        const key = this.pinnedStorageKey();
        if (!key)
          return;
        if (this.pinnedId !== null && this.pinnedType !== null) {
          localStorage.setItem(key, JSON.stringify({ id: this.pinnedId, type: this.pinnedType }));
        } else {
          localStorage.removeItem(key);
        }
      }
      refreshPinnedItem() {
        if (this.pinnedId === null || this.pinnedType === null) {
          this.pinnedItem = null;
          return;
        }
        if (this.pinnedType === "message") {
          this.pinnedItem = this.messages.find((m) => m.id === this.pinnedId) || null;
        } else {
          this.pinnedItem = this.polls.find((p) => p.id === this.pinnedId) || null;
        }
      }
      buildInfoMessages() {
        const info = [];
        const time = this.formatEventTime();
        if (time) {
          info.push({
            key: "time",
            label: "Time",
            content: time,
            anchorId: "chat-info-time"
          });
        }
        const place = this.formatEventPlace();
        if (place) {
          info.push({
            key: "place",
            label: "Location",
            content: place,
            anchorId: "chat-info-place"
          });
        }
        const mapLink = this.getMapLink();
        if (mapLink) {
          info.push({
            key: "link",
            label: "Map Link",
            content: mapLink,
            anchorId: "chat-info-link",
            link: mapLink
          });
        }
        this.infoMessages = info;
      }
      formatEventTime() {
        if (!this.event)
          return "";
        const date = this.event.date ? /* @__PURE__ */ new Date(`${this.event.date}T00:00:00`) : null;
        const start = this.event.startTime ? this.event.startTime.slice(0, 5) : "";
        const end = this.event.endTime ? this.event.endTime.slice(0, 5) : "";
        const datePart = date ? date.toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" }) : "";
        const timePart = [start, end].filter(Boolean).join(" - ");
        return [datePart, timePart].filter(Boolean).join(" ");
      }
      formatEventPlace() {
        if (!this.event)
          return "";
        if (this.event.city)
          return this.event.city;
        if (Number.isFinite(this.event.latitude) && Number.isFinite(this.event.longitude)) {
          return `${this.event.latitude.toFixed(5)}, ${this.event.longitude.toFixed(5)}`;
        }
        return "";
      }
      getMapLink() {
        if (!this.event)
          return "";
        if (Number.isFinite(this.event.latitude) && Number.isFinite(this.event.longitude)) {
          return `https://www.google.com/maps/search/?api=1&query=${this.event.latitude},${this.event.longitude}`;
        }
        if (this.event.city) {
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.event.city)}`;
        }
        return "";
      }
      scrollToBottom() {
        requestAnimationFrame(() => {
          this.doScrollToBottom();
          setTimeout(() => this.doScrollToBottom(), 50);
          setTimeout(() => this.doScrollToBottom(), 150);
        });
      }
      doScrollToBottom() {
        const container = this.messagesContainer?.nativeElement;
        if (!container)
          return;
        container.scrollTop = container.scrollHeight;
      }
      buildBannedPatterns(words) {
        this.bannedPatterns = [];
        this.bannedRaw = [];
        if (!Array.isArray(words))
          return;
        words.forEach((word) => {
          const normalized = this.normalizeContent(word);
          if (!normalized) {
            if (word)
              this.bannedRaw.push(word);
            return;
          }
          this.bannedPatterns.push(this.buildPhrasePattern(normalized));
        });
      }
      isBannedMessage(content) {
        if (!content)
          return false;
        for (const raw of this.bannedRaw) {
          if (raw && content.includes(raw)) {
            return true;
          }
        }
        const normalized = this.normalizeContent(content);
        if (!normalized)
          return false;
        return this.bannedPatterns.some((pattern) => pattern.test(normalized));
      }
      normalizeContent(input) {
        if (!input)
          return "";
        const lower = input.toLowerCase();
        const leet = this.replaceLeet(lower);
        const noDiacritics = leet.normalize("NFD").replace(/[\u0300-\u036f]+/g, "");
        const cleaned = noDiacritics.replace(/[^a-z0-9]+/g, " ").trim();
        return cleaned.replace(/\s+/g, " ");
      }
      replaceLeet(input) {
        const map = {
          "@": "a",
          "0": "o",
          "1": "i",
          "!": "i",
          "3": "e",
          "4": "a",
          "5": "s",
          "$": "s",
          "7": "t",
          "8": "b"
        };
        return input.split("").map((char) => map[char] ?? char).join("");
      }
      buildPhrasePattern(normalizedPhrase) {
        const tokens = normalizedPhrase.split(/\s+/).filter(Boolean);
        const tokenPatterns = tokens.map((token) => this.buildTokenPattern(token));
        const joined = tokenPatterns.join("\\s+");
        return new RegExp(`(?:^|\\s)${joined}(?:\\s|$)`);
      }
      buildTokenPattern(token) {
        return token.split("").map((char) => this.escapeRegex(char)).join("\\s*");
      }
      escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      static ctorParameters = () => [
        { type: ChatService }
      ];
      static propDecorators = {
        event: [{ type: Input }],
        currentUserId: [{ type: Input }],
        close: [{ type: Output }],
        messagesContainer: [{ type: ViewChild, args: ["messagesContainer"] }]
      };
    };
    EventChatModalComponent = __decorate([
      Component({
        selector: "event-chat-modal",
        standalone: true,
        imports: [CommonModule, FormsModule, MatIconModule],
        template: event_chat_modal_default,
        styles: [event_chat_modal_default2]
      })
    ], EventChatModalComponent);
  }
});

// src/components/my-events-modal/my-events-modal.component.ts
var MyEventsModal;
var init_my_events_modal_component = __esm({
  "src/components/my-events-modal/my-events-modal.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_my_events_modal();
    init_my_events_modal2();
    init_core();
    init_common();
    init_icon();
    init_event_service();
    init_confirmation_service();
    init_event_card_component();
    init_event_share_modal_component();
    init_event_chat_modal3();
    MyEventsModal = class MyEventsModal2 {
      eventService;
      confirmation;
      userId;
      close = new EventEmitter();
      focusLocal = new EventEmitter();
      view = "organized";
      getViewTitle() {
        if (this.expandedEventRequestsId)
          return "Manage Requests";
        if (this.activeTab === "ORGANIZED")
          return "My Events";
        if (this.activeTab === "JOINED")
          return "Joined Events";
        return "Saved Events";
      }
      onBack() {
        if (this.expandedEventRequestsId) {
          this.expandedEventRequestsId = null;
        } else {
          this.close.emit();
        }
      }
      activeTab = "ORGANIZED";
      organizedEvents = [];
      joinedEvents = [];
      savedEvents = [];
      loading = false;
      sharingEvent = null;
      // Stato per la vista richieste partecipazione.
      expandedEventRequestsId = null;
      showChatModal = false;
      chatEvent = null;
      constructor(eventService, confirmation) {
        this.eventService = eventService;
        this.confirmation = confirmation;
      }
      ngOnInit() {
        this.loadData();
      }
      loadData() {
        this.loading = true;
        this.eventService.getOrganizedEvents(this.userId).subscribe({
          next: (events) => this.organizedEvents = events,
          error: (err) => console.error("Error loading organized events", err)
        });
        this.eventService.getJoinedEvents(this.userId).subscribe({
          next: (events) => {
            this.joinedEvents = events;
          },
          error: (err) => {
            console.error("Error loading joined events", err);
          }
        });
        this.eventService.getSavedEvents(this.userId).subscribe({
          next: (events) => {
            this.savedEvents = events.filter(this.isFutureEvent);
            this.loading = false;
          },
          error: (err) => {
            console.error("Error loading saved events", err);
            this.loading = false;
          }
        });
      }
      isFutureEvent = (event) => {
        if (!event.date)
          return true;
        const end = event.endTime || event.startTime || "23:59";
        const eventDateTime = /* @__PURE__ */ new Date(`${event.date}T${end}`);
        return eventDateTime.getTime() >= Date.now();
      };
      switchTab(tab) {
        this.activeTab = tab;
        this.expandedEventRequestsId = null;
      }
      toggleRequests(eventId) {
        if (this.expandedEventRequestsId === eventId) {
          this.expandedEventRequestsId = null;
        } else {
          this.expandedEventRequestsId = eventId;
        }
      }
      deleteEvent(event) {
        return __async(this, null, function* () {
          const confirmed = yield this.confirmation.confirm({
            title: "Delete event",
            message: "Are you sure you want to delete this event?",
            confirmText: "Delete",
            cancelText: "Cancel",
            tone: "danger"
          });
          if (!confirmed)
            return;
          this.eventService.deleteEvent(event.id).subscribe({
            next: () => {
              this.organizedEvents = this.organizedEvents.filter((e) => e.id !== event.id);
              if (this.expandedEventRequestsId === event.id) {
                this.expandedEventRequestsId = null;
              }
            },
            error: (err) => console.error("Error deleting event", err)
          });
        });
      }
      openChat(event) {
        this.chatEvent = event;
        this.showChatModal = true;
      }
      closeChat() {
        this.showChatModal = false;
        this.chatEvent = null;
      }
      acceptRequest(event, user) {
        this.eventService.acceptParticipation(event.id, user.id).subscribe({
          next: () => {
            if (event.pendingUsersList) {
              event.pendingUsersList = event.pendingUsersList.filter((u) => u.id !== user.id);
            }
            if (!event.acceptedUsersList) {
              event.acceptedUsersList = [];
            }
            event.acceptedUsersList.push(user);
            event.acceptedUsersList.sort((u1, u2) => (u1.name || "").localeCompare(u2.name || ""));
            event.occupiedSpots = (event.occupiedSpots || 0) + 1;
          },
          error: (err) => console.error("Error accepting", err)
        });
      }
      rejectRequest(event, user) {
        this.eventService.rejectParticipation(event.id, user.id).subscribe({
          next: () => {
            if (event.pendingUsersList) {
              event.pendingUsersList = event.pendingUsersList.filter((u) => u.id !== user.id);
            }
          },
          error: (err) => console.error("Error rejecting", err)
        });
      }
      removeParticipant(event, user) {
        return __async(this, null, function* () {
          const confirmed = yield this.confirmation.confirm({
            title: "Remove participant",
            message: `Remove ${user.name} ${user.surname} from this event?`,
            confirmText: "Remove",
            cancelText: "Cancel",
            tone: "danger"
          });
          if (!confirmed)
            return;
          this.eventService.removeParticipant(event.id, user.id, this.userId).subscribe({
            next: () => {
              if (event.acceptedUsersList) {
                event.acceptedUsersList = event.acceptedUsersList.filter((u) => u.id !== user.id);
              }
              event.occupiedSpots = Math.max(0, (event.occupiedSpots || 0) - 1);
            },
            error: (err) => console.error("Error removing participant", err)
          });
        });
      }
      openShare(event) {
        this.sharingEvent = event;
      }
      goToEvent(event) {
        this.focusLocal.emit(event);
      }
      formatDateTime(event) {
        const date = event.date ? /* @__PURE__ */ new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : "";
        const datePart = date ? date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "";
        return `${datePart} | ${start}`;
      }
      static ctorParameters = () => [
        { type: EventService },
        { type: ConfirmationService }
      ];
      static propDecorators = {
        userId: [{ type: Input }],
        close: [{ type: Output }],
        focusLocal: [{ type: Output }]
      };
    };
    MyEventsModal = __decorate([
      Component({
        selector: "app-my-events-modal",
        standalone: true,
        imports: [CommonModule, MatIconModule, EventCardComponent, EventShareModalComponent, EventChatModalComponent],
        template: my_events_modal_default,
        styles: [my_events_modal_default2]
      })
    ], MyEventsModal);
  }
});

// angular:jit:template:src/components/account-modal/account-modal.html
var account_modal_default;
var init_account_modal = __esm({
  "angular:jit:template:src/components/account-modal/account-modal.html"() {
    account_modal_default = `<div class="modal-backdrop" (click)="onClose()">
    <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
            <button class="back-arrow" [class.back-arrow--profile]="view === 'profile'" type="button"
                (click)="onBackOrClose()" [attr.aria-label]="view === 'profile' ? 'Close' : 'Back'">
                <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="title-wrap">
                <h2 [class.yellow-title]="view !== 'profile'">{{ getViewTitle() }}</h2>
            </div>
            <button class="close-btn close tablet-desktop-only" (click)="onClose()" aria-label="Close">
                <mat-icon>close</mat-icon>
            </button>
        </div>

        <div class="account-content" *ngIf="view === 'profile'">
            <div class="content-row">
                <div class="content-col left-col">
                    <div class="profile-section">
                        <div class="avatar-container">
                            @if (user?.profileImage) {
                            <img [src]="user?.profileImage" alt="Profile" class="profile-image">
                            } @else {
                            <div class="profile-placeholder">{{ getInitials(user?.name || '') }}</div>
                            }
                            <button class="edit-photo-btn" (click)="onChangePhoto()">
                                <mat-icon>edit</mat-icon>
                            </button>
                        </div>
                        <h3 class="user-name">{{ user?.name }}</h3>
                        <p class="user-email">
                            <mat-icon>mail_outline</mat-icon>
                            {{ getDiscreteEmail(user?.email) }}
                        </p>
                        <p class="user-description">{{ user?.description || 'Find The Glow' }}</p>

                        <div class="stats-container">
                            <div class="stat-item clickable" (click)="showFollowers()">
                                <span class="stat-value">{{ user?.followersCount || 0 }}</span>
                                <span class="stat-label">Followers</span>
                            </div>
                            <div class="stat-divider"></div>
                            <div class="stat-item clickable" (click)="showFollowing()">
                                <span class="stat-value">{{ user?.followingCount || 0 }}</span>
                                <span class="stat-label">Following</span>
                            </div>
                        </div>
                    </div>

                    <div class="actions-section">
                        <button class="action-btn" (click)="showEditProfile()">
                            <mat-icon>settings</mat-icon>
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div class="vertical-divider"></div>

                <div class="content-col right-col">
                    <div class="share-section-embedded">
                        <span class="share-header">Share Profile</span>
                        <div class="qr-code-wrapper">
                            <img [src]="getQrCodeUrl()" alt="Profile QR Code">
                        </div>
                        <div class="share-details">
                            <div class="mini-link-group">
                                <button class="mini-copy-btn" (click)="copyShareLink()">
                                    <mat-icon>content_copy</mat-icon>
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="edit-profile-view" *ngIf="view === 'edit-profile'">


            <div class="edit-content-layout">
                <div class="edit-section left-section">
                    <h4>Personal Information</h4>
                    <div class="form-group">
                        <label>Name</label>
                        <input [(ngModel)]="editData.name" placeholder="Name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input [value]="editData.email" readonly disabled class="readonly-input">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea [(ngModel)]="editData.description" placeholder="Description (e.g. Find The Glow)"
                            rows="3"></textarea>
                    </div>
                    <button class="button" (click)="onSaveProfile()">Update Details</button>
                </div>

                <div class="vertical-divider"></div>

                <div class="edit-section right-section">
                    <h4>Change Password</h4>
                    <div class="form-group">
                        <label>Current Password</label>
                        <input type="password" [(ngModel)]="passwordData.old" placeholder="Current Password">
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" [(ngModel)]="passwordData.new" placeholder="New Password">
                    </div>
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" [(ngModel)]="passwordData.confirm" placeholder="Confirm Password">
                    </div>
                    <button class="button" (click)="onChangePassword()">Change Password</button>
                </div>
            </div>
        </div>

        <div class="user-list-view" *ngIf="view !== 'profile' && view !== 'edit-profile'">

            <div class="user-list" *ngIf="!loadingList; else loadingTemplate">
                <div class="user-item" *ngFor="let u of userList">
                    <div class="user-info" (click)="openProfileFromList(u)">
                        <img *ngIf="u.profileImage" [src]="u.profileImage" class="list-avatar">
                        <div *ngIf="!u.profileImage" class="list-avatar-placeholder">{{ getInitials(u.name) }}</div>
                        <span class="list-username">{{ u.name }}</span>
                    </div>

                    <button *ngIf="view === 'following' || (view === 'followers' && followingIds.has(u.id.toString()))"
                        class="unfollow-btn" (click)="onUnfollow(u)">
                        Unfollow
                    </button>

                    <button *ngIf="view === 'followers' && !followingIds.has(u.id.toString())" class="follow-btn"
                        (click)="onFollow(u)">
                        Follow
                    </button>
                </div>
                <div *ngIf="userList.length === 0" class="empty-list">
                    No users found.
                </div>
            </div>

            <ng-template #loadingTemplate>
                <div class="loading-spinner">Loading...</div>
            </ng-template>
        </div>
    </div>
</div>
`;
  }
});

// angular:jit:style:src/components/account-modal/account-modal.css
var account_modal_default2;
var init_account_modal2 = __esm({
  "angular:jit:style:src/components/account-modal/account-modal.css"() {
    account_modal_default2 = "/* src/components/account-modal/account-modal.css */\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: var(--modal-backdrop-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 99999;\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n}\n.modal-container {\n  background: var(--modal-surface);\n  width: 800px;\n  max-width: 95vw;\n  height: auto;\n  border-radius: var(--modal-radius);\n  padding: 24px;\n  border: var(--modal-border);\n  box-shadow: var(--modal-shadow);\n  animation: slideUp 0.3s ease-out;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.edit-profile-view {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n.edit-content-layout {\n  display: flex;\n  flex-direction: row;\n  gap: 24px;\n  flex: 1;\n  overflow-y: auto;\n  padding: 5%;\n}\n.edit-content-layout::-webkit-scrollbar {\n  width: 6px;\n}\n.edit-content-layout::-webkit-scrollbar-thumb {\n  background-color: var(--color-gray);\n  border-radius: 3px;\n}\n@keyframes slideUp {\n  from {\n    transform: translateY(20px);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 24px;\n  font-weight: 700;\n}\n.yellow-title {\n  color: var(--color-accent) !important;\n}\n.back-arrow {\n  background: none;\n  border: none;\n  color: var(--color-white);\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.back-arrow--profile {\n  display: none;\n}\n.back-arrow mat-icon {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n}\n@media (max-width: 768px) {\n  .modal-header {\n    height: 70px;\n    position: relative;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 24px;\n    border-bottom: var(--modal-header-border);\n    margin-bottom: 0;\n  }\n  .title-wrap {\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    margin: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    pointer-events: none;\n    z-index: 5;\n  }\n  .modal-header h2 {\n    font-size: 24px !important;\n    color: var(--color-accent) !important;\n    text-align: center;\n    margin: 0 !important;\n    width: auto !important;\n    height: 100% !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    line-height: normal !important;\n  }\n  .back-arrow {\n    position: absolute;\n    left: 24px;\n    cursor: pointer;\n    color: var(--color-white);\n    display: flex !important;\n    align-items: center;\n    justify-content: center;\n    z-index: 10;\n    height: 100%;\n    top: 0;\n  }\n  .back-arrow.back-arrow--profile {\n    display: flex !important;\n  }\n  .close {\n    position: absolute;\n    right: 24px;\n    z-index: 10;\n    display: none !important;\n  }\n}\n.account-content {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  height: 100%;\n}\n.content-row {\n  display: flex;\n  flex-direction: row;\n  flex: 1;\n  gap: 24px;\n  align-items: stretch;\n}\n.content-col {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n.left-col {\n  justify-content: space-between;\n  padding-bottom: 10px;\n}\n.right-col {\n  align-items: center;\n  justify-content: center;\n}\n.profile-section {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  margin-bottom: auto;\n}\n.share-section-embedded {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 15px;\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 12px;\n  padding: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.05);\n  width: 100%;\n  box-sizing: border-box;\n  height: 100%;\n  justify-content: center;\n}\n.vertical-divider {\n  width: 1px;\n  background: rgba(255, 255, 255, 0.1);\n}\n.edit-section {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n}\n.qr-code-wrapper img {\n  width: 160px;\n  height: 160px;\n  display: block;\n}\n.section-divider {\n  display: none;\n}\n.modal-header h2 {\n  margin: 0;\n  color: var(--color-accent);\n  font-size: 20px;\n  font-weight: 600;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.profile-section {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.avatar-container {\n  position: relative;\n  margin-bottom: 8px;\n}\n.profile-image {\n  width: 70px;\n  height: 70px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 2px solid var(--color-accent);\n}\n.profile-placeholder {\n  width: 70px;\n  height: 70px;\n  border-radius: 50%;\n  background: var(--color-gray);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 28px;\n  font-weight: 600;\n  color: var(--color-white);\n  border: 2px solid var(--color-accent);\n}\n.edit-photo-btn {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  background: var(--color-accent);\n  color: black;\n  border: none;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  transition: transform 0.2s;\n}\n.edit-photo-btn:hover {\n  transform: scale(1.1);\n}\n.edit-photo-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.user-name {\n  margin: 4px 0 0 0;\n  color: var(--color-white);\n  font-size: 24px;\n  font-weight: 700;\n  letter-spacing: -0.5px;\n  line-height: 1.1;\n}\n.user-email {\n  margin: 4px 0 0 0;\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 13px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  font-weight: 400;\n}\n.user-email mat-icon {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n  opacity: 0.8;\n}\n.user-description {\n  margin: 8px 0 0 0;\n  color: #e0e0e0;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 1.4;\n  max-width: 90%;\n  opacity: 0.9;\n}\n.form-group textarea {\n  background: rgba(255, 255, 255, 0.05) !important;\n  border: 1px solid var(--color-gray);\n  border-radius: 8px;\n  padding: 10px;\n  color: var(--color-white) !important;\n  font-size: 14px;\n  font-family: inherit;\n  resize: none;\n  min-height: 80px;\n}\n.stats-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 20px;\n  margin-top: 10px;\n  padding: 8px 0;\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  width: 100%;\n}\n.stat-item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.stat-value {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--color-white);\n}\n.stat-label {\n  font-size: 12px;\n  color: var(--color-light-gray);\n}\n.stat-divider {\n  width: 1px;\n  height: 30px;\n  background: rgba(255, 255, 255, 0.1);\n}\n.actions-section {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-top: 15px;\n}\n.action-btn {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 16px;\n  border-radius: 12px;\n  border: 1px solid var(--color-gray);\n  background: rgba(255, 255, 255, 0.05);\n  color: var(--color-white);\n  font-size: 15px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.action-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: var(--color-light-gray);\n}\n.action-btn mat-icon {\n  color: var(--color-accent);\n}\n.stat-item.clickable {\n  cursor: pointer;\n  transition: opacity 0.2s;\n}\n.stat-item.clickable:hover {\n  opacity: 0.8;\n}\n.user-list-view {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n.list-header {\n  display: flex;\n  align-items: center;\n  margin-bottom: 20px;\n  gap: 10px;\n}\n.list-header h3 {\n  margin: 0;\n  color: var(--color-white);\n  font-size: 20px;\n}\n.back-btn {\n  background: none;\n  border: none;\n  color: var(--color-light-gray);\n  cursor: pointer;\n  padding: 0;\n  display: flex;\n  align-items: center;\n}\n.back-btn:hover {\n  color: var(--color-white);\n}\n.user-list {\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n  overflow-y: auto;\n  flex: 1;\n  padding-right: 5px;\n  scrollbar-width: none;\n}\n.user-list::-webkit-scrollbar {\n  display: none;\n}\n.user-item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px;\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.05);\n}\n.user-info {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  cursor: pointer;\n}\n.list-avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.list-avatar-placeholder {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: var(--color-gray);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--color-white);\n  font-size: 14px;\n  font-weight: 600;\n}\n.list-username {\n  color: var(--color-white);\n  font-size: 16px;\n  font-weight: 500;\n}\n.unfollow-btn {\n  background: transparent;\n  border: 1px solid var(--color-error, #ff4444);\n  color: #ffffff;\n  padding: 6px 12px;\n  border-radius: 4px;\n  font-size: 12px;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.unfollow-btn:hover {\n  background: var(--color-error, #ff4444);\n  color: white;\n}\n.empty-list {\n  color: var(--color-light-gray);\n  text-align: center;\n  padding: 20px;\n}\n.loading-spinner {\n  color: var(--color-accent);\n  text-align: center;\n  padding: 20px;\n}\n.follow-btn {\n  background: var(--color-accent);\n  border: 1px solid var(--color-accent);\n  color: black;\n  padding: 6px 12px;\n  border-radius: 4px;\n  font-size: 12px;\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.2s;\n}\n.follow-btn:hover {\n  opacity: 0.9;\n  transform: scale(1.05);\n}\n.edit-section h4 {\n  color: var(--color-accent);\n  margin: 0 0 5px 0;\n  font-size: 16px;\n  font-weight: 600;\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group label {\n  color: var(--color-light-gray);\n  font-size: 12px;\n}\n.form-group input {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid var(--color-gray);\n  border-radius: 8px;\n  padding: 10px;\n  color: var(--color-white);\n  font-size: 14px;\n}\n.form-group input.readonly-input {\n  opacity: 0.6;\n  cursor: not-allowed;\n  background: rgba(255, 255, 255, 0.02);\n}\n.form-group input:focus {\n  outline: none;\n  border-color: var(--color-accent);\n}\n.form-group textarea {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid var(--color-gray);\n  border-radius: 8px;\n  padding: 10px;\n  color: var(--color-white);\n  font-size: 14px;\n  font-family: inherit;\n  resize: none;\n}\n.form-group textarea:focus {\n  outline: none;\n  border-color: var(--color-accent);\n}\n@media (max-width: 768px) {\n  .modal-container {\n    width: 100%;\n    max-width: 100%;\n    height: 100%;\n    max-height: 100vh;\n    border-radius: 0;\n    border: none;\n    overflow-y: auto;\n    padding: 0 0 80px 0;\n  }\n  .content-row,\n  .edit-content-layout {\n    flex-direction: column;\n    gap: 24px;\n    background:\n      linear-gradient(\n        160deg,\n        rgba(20, 20, 20),\n        rgba(12, 12, 12));\n  }\n  .vertical-divider {\n    display: none;\n  }\n  .content-col,\n  .left-col,\n  .right-col,\n  .edit-section {\n    width: 100%;\n    flex: none;\n    padding: 24px;\n    box-sizing: border-box;\n  }\n  .share-section-embedded {\n    padding: 20px;\n  }\n  .qr-code-wrapper img {\n    width: 140px;\n    height: 140px;\n  }\n  .profile-section {\n    margin-bottom: 24px;\n    padding: 0 8px;\n  }\n  .edit-section {\n    padding: 0 8px;\n  }\n  .user-list {\n    padding: 24px;\n  }\n}\n.share-header {\n  color: var(--color-white);\n  font-size: 14px;\n  font-weight: 500;\n  opacity: 0.8;\n}\n.qr-code-wrapper {\n  background: white;\n  padding: 6px;\n  border-radius: 10px;\n  flex-shrink: 0;\n}\n.share-details {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n}\n.mini-link-group {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n.mini-copy-btn {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid var(--color-accent);\n  color: var(--color-accent);\n  border-radius: 8px;\n  padding: 8px 16px;\n  font-size: 14px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: all 0.2s;\n  width: 100%;\n  justify-content: center;\n}\n.mini-copy-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.mini-copy-btn:hover {\n  background: var(--color-accent);\n  color: black;\n}\n/*# sourceMappingURL=account-modal.css.map */\n";
  }
});

// src/components/account-modal/account-modal.component.ts
var QRCode, AccountModalComponent;
var init_account_modal_component = __esm({
  "src/components/account-modal/account-modal.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_account_modal();
    init_account_modal2();
    init_core();
    init_user_service();
    init_confirmation_service();
    init_common();
    init_icon();
    init_snack_bar();
    init_forms();
    QRCode = __toESM(require_browser());
    AccountModalComponent = class AccountModalComponent2 {
      userService;
      confirmation;
      snackBar;
      _user = null;
      qrCodeUrl = "";
      set user(value) {
        this._user = value;
        this.generateQrCode();
      }
      get user() {
        return this._user;
      }
      close = new EventEmitter();
      changePhoto = new EventEmitter();
      openProfile = new EventEmitter();
      view = "profile";
      userList = [];
      followingIds = /* @__PURE__ */ new Set();
      loadingList = false;
      editData = { name: "", email: "", description: "" };
      passwordData = { old: "", new: "", confirm: "" };
      constructor(userService, confirmation, snackBar) {
        this.userService = userService;
        this.confirmation = confirmation;
        this.snackBar = snackBar;
      }
      onClose() {
        this.view = "profile";
        this.close.emit();
      }
      onBack() {
        if (this.view !== "profile") {
          this.view = "profile";
        }
      }
      onBackOrClose() {
        if (this.view !== "profile") {
          this.onBack();
          return;
        }
        this.onClose();
      }
      getViewTitle() {
        switch (this.view) {
          case "edit-profile":
            return "Edit Profile";
          case "followers":
            return "Followers";
          case "following":
            return "Following";
          default:
            return "Account";
        }
      }
      onChangePhoto() {
        this.changePhoto.emit();
      }
      getInitials(name) {
        if (!name)
          return "";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      getDiscreteEmail(email) {
        if (!email)
          return "";
        if (email.length <= 25)
          return email;
        const parts = email.split("@");
        if (parts.length !== 2)
          return email;
        const [user, domain] = parts;
        return `...${user.slice(-3)}@${domain}`;
      }
      showFollowers() {
        if (!this.user)
          return;
        const userId = this.user.id;
        this.view = "followers";
        this.loadingList = true;
        this.userService.getFollowers(userId).subscribe({
          next: (followers) => {
            this.userList = followers;
            this.userService.getFollowing(userId).subscribe({
              next: (following) => {
                this.followingIds = new Set(following.map((u) => u.id.toString()));
                this.loadingList = false;
              },
              error: (err) => {
                console.error("Error fetching following list", err);
                this.loadingList = false;
              }
            });
          },
          error: (err) => {
            console.error(err);
            this.loadingList = false;
          }
        });
      }
      showFollowing() {
        if (!this.user)
          return;
        this.view = "following";
        this.loadingList = true;
        this.userService.getFollowing(this.user.id).subscribe({
          next: (users) => {
            this.userList = users;
            this.loadingList = false;
          },
          error: (err) => {
            console.error(err);
            this.loadingList = false;
          }
        });
      }
      onFollow(userToFollow) {
        if (!this.user)
          return;
        this.userService.followUser(this.user.id, userToFollow.id).subscribe({
          next: () => {
            this.followingIds.add(userToFollow.id.toString());
            if (this.user) {
              this.user.followingCount = (this.user.followingCount || 0) + 1;
            }
            this.userService.notifyUserUpdate();
          },
          error: (err) => console.error(err)
        });
      }
      onUnfollow(userToUnfollow) {
        return __async(this, null, function* () {
          if (!this.user)
            return;
          const confirmed = yield this.confirmation.confirm({
            title: "Unfollow user",
            message: `Are you sure you want to unfollow ${userToUnfollow.name}?`,
            confirmText: "Unfollow",
            cancelText: "Cancel",
            confirmClass: "white-text"
          });
          if (!confirmed)
            return;
          this.userService.unfollowUser(this.user.id, userToUnfollow.id).subscribe({
            next: () => {
              if (this.view === "following") {
                this.userList = this.userList.filter((u) => u.id !== userToUnfollow.id);
              } else {
                this.followingIds.delete(userToUnfollow.id.toString());
              }
              if (this.user) {
                this.user.followingCount = (this.user.followingCount || 1) - 1;
              }
              this.userService.notifyUserUpdate();
            },
            error: (err) => console.error(err)
          });
        });
      }
      openProfileFromList(userToOpen) {
        if (!userToOpen?.id)
          return;
        this.view = "profile";
        this.openProfile.emit(userToOpen.id.toString());
      }
      showEditProfile() {
        if (!this.user)
          return;
        this.view = "edit-profile";
        this.editData = {
          name: this.user.name,
          email: this.user.email,
          description: this.user.description || ""
        };
        this.passwordData = { old: "", new: "", confirm: "" };
      }
      onSaveProfile() {
        if (!this.user)
          return;
        this.userService.updateUser(this.user.id, this.editData).subscribe({
          next: (updatedUser) => {
            if (this.user) {
              this.user.name = updatedUser.name;
              this.user.email = updatedUser.email;
              this.user.description = updatedUser.description;
            }
            this.showToast("Profile updated successfully");
            this.userService.notifyUserUpdate();
          },
          error: (err) => {
            console.error(err);
            this.showToast("Failed to update profile", "error");
          }
        });
      }
      getShareLink() {
        if (!this.user)
          return "";
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}/?user=${this.user.id}`;
      }
      generateQrCode() {
        if (!this.user) {
          this.qrCodeUrl = "";
          return;
        }
        const link = this.getShareLink();
        QRCode.toDataURL(link, { width: 200, margin: 1, color: { dark: "#000000", light: "#ffffff" } }).then((url) => {
          this.qrCodeUrl = url;
        }).catch((err) => {
          console.error("QR Code generation failed", err);
          this.qrCodeUrl = "";
        });
      }
      getQrCodeUrl() {
        return this.qrCodeUrl;
      }
      copyShareLink() {
        const link = this.getShareLink();
        navigator.clipboard.writeText(link).then(() => {
          this.showToast("Link copied to clipboard!");
        }).catch((err) => {
          console.error("Failed to copy: ", err);
          this.showToast("Unable to copy the link.", "error");
        });
      }
      onChangePassword() {
        if (!this.user)
          return;
        if (this.passwordData.new !== this.passwordData.confirm) {
          this.showToast("New passwords do not match", "error");
          return;
        }
        if (!this.passwordData.old || !this.passwordData.new) {
          this.showToast("Please fill in default fields", "error");
          return;
        }
        this.userService.changePassword(this.user.id, this.passwordData.old, this.passwordData.new).subscribe({
          next: () => {
            this.showToast("Password changed successfully");
            this.passwordData = { old: "", new: "", confirm: "" };
          },
          error: (err) => {
            console.error(err);
            this.showToast("Failed to change password. Existing password may be incorrect.", "error");
          }
        });
      }
      showToast(message, tone = "default") {
        this.snackBar.open(message, void 0, {
          duration: tone === "error" ? 700 : 700,
          horizontalPosition: "center",
          verticalPosition: "top",
          panelClass: tone === "error" ? ["toast-snackbar", "toast-snackbar--error"] : ["toast-snackbar"]
        });
      }
      static ctorParameters = () => [
        { type: UserService },
        { type: ConfirmationService },
        { type: MatSnackBar }
      ];
      static propDecorators = {
        user: [{ type: Input }],
        close: [{ type: Output }],
        changePhoto: [{ type: Output }],
        openProfile: [{ type: Output }]
      };
    };
    AccountModalComponent = __decorate([
      Component({
        selector: "app-account-modal",
        standalone: true,
        imports: [CommonModule, MatIconModule, MatSnackBarModule, FormsModule],
        template: account_modal_default,
        styles: [account_modal_default2]
      })
    ], AccountModalComponent);
  }
});

// src/components/action-bar/action-bar.ts
var ActionBarComponent;
var init_action_bar3 = __esm({
  "src/components/action-bar/action-bar.ts"() {
    "use strict";
    init_tslib_es6();
    init_action_bar();
    init_action_bar2();
    init_core();
    init_common();
    init_icon();
    init_user_menu3();
    init_notification_menu3();
    init_notification_service();
    init_esm();
    init_my_events_modal_component();
    init_account_modal_component();
    init_user_service();
    ActionBarComponent = class ActionBarComponent2 {
      notificationService;
      elementRef;
      userService;
      loggedUser = null;
      action = new EventEmitter();
      openProfile = new EventEmitter();
      openChatFromNotification = new EventEmitter();
      openEventFromNotification = new EventEmitter();
      focusEvent = new EventEmitter();
      showUserMenu = false;
      showNotifications = false;
      showMyEventsModal = false;
      showAccountModal = false;
      hasUnread = false;
      pollSubscription = null;
      constructor(notificationService, elementRef, userService) {
        this.notificationService = notificationService;
        this.elementRef = elementRef;
        this.userService = userService;
      }
      ngOnInit() {
        this.startPolling();
      }
      ngOnDestroy() {
        this.stopPolling();
      }
      ngOnChanges() {
        if (this.loggedUser) {
          this.checkUnreadNotifications();
          this.startPolling();
        } else {
          this.stopPolling();
        }
      }
      startPolling() {
        if (this.pollSubscription)
          return;
        if (!this.loggedUser)
          return;
        this.pollSubscription = interval(5e3).pipe(switchMap(() => {
          const requests = [];
          if (this.loggedUser && !this.showNotifications) {
            requests.push(this.notificationService.getNotifications(this.loggedUser.id));
          }
          if (this.loggedUser) {
            this.userService.notifyUserUpdate();
          }
          if (requests.length > 0) {
            return this.notificationService.getNotifications(this.loggedUser.id);
          }
          return [];
        })).subscribe({
          next: (notifications) => {
            if (Array.isArray(notifications)) {
              this.hasUnread = notifications.some((n) => !n.isRead);
            }
          },
          error: (err) => console.error("Error polling notifications", err)
        });
      }
      stopPolling() {
        if (this.pollSubscription) {
          this.pollSubscription.unsubscribe();
          this.pollSubscription = null;
        }
      }
      onClickOutside(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
          this.showUserMenu = false;
          this.showNotifications = false;
        }
      }
      checkUnreadNotifications() {
        if (!this.loggedUser)
          return;
        this.notificationService.getNotifications(this.loggedUser.id).subscribe({
          next: (notifications) => {
            this.hasUnread = notifications.some((n) => !n.isRead);
          },
          error: (err) => console.error("Error fetching notifications status", err)
        });
      }
      toggleUserMenu(event) {
        if (event)
          event.stopPropagation();
        this.showUserMenu = !this.showUserMenu;
        this.showNotifications = false;
      }
      toggleNotifications(event) {
        event.stopPropagation();
        this.showNotifications = !this.showNotifications;
        this.showUserMenu = false;
        if (this.showNotifications && this.loggedUser) {
          this.notificationService.markAllAsRead(this.loggedUser.id).subscribe({
            next: () => {
              this.hasUnread = false;
            },
            error: (err) => console.error("Error marking read", err)
          });
        } else if (!this.showNotifications && this.loggedUser) {
          this.checkUnreadNotifications();
        }
      }
      onMenuAction(actionName) {
        if (actionName === "my-events") {
          this.showMyEventsModal = true;
        } else if (actionName === "account") {
          this.showAccountModal = true;
        } else {
          this.action.emit(actionName);
        }
        this.showUserMenu = false;
      }
      onOpenProfileFromAccount(userId) {
        this.showAccountModal = false;
        this.openProfile.emit(userId);
      }
      onChangePhotoFromAccount() {
        this.showAccountModal = false;
        this.action.emit("change-photo");
      }
      onOpenChatFromNotification(eventId) {
        this.showNotifications = false;
        this.openChatFromNotification.emit(eventId);
      }
      onOpenEventFromNotification(eventId) {
        this.showNotifications = false;
        this.openEventFromNotification.emit(eventId);
      }
      onFocusEvent(event) {
        this.showMyEventsModal = false;
        this.focusEvent.emit(event);
      }
      onAddEvent() {
        this.action.emit("add-event");
      }
      getInitials(name) {
        if (!name)
          return "";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      static ctorParameters = () => [
        { type: NotificationService },
        { type: ElementRef },
        { type: UserService }
      ];
      static propDecorators = {
        loggedUser: [{ type: Input }],
        action: [{ type: Output }],
        openProfile: [{ type: Output }],
        openChatFromNotification: [{ type: Output }],
        openEventFromNotification: [{ type: Output }],
        focusEvent: [{ type: Output }],
        onClickOutside: [{ type: HostListener, args: ["document:click", ["$event"]] }]
      };
    };
    ActionBarComponent = __decorate([
      Component({
        selector: "app-action-bar",
        standalone: true,
        imports: [CommonModule, MatIconModule, UserMenu, NotificationMenuComponent, MyEventsModal, AccountModalComponent],
        template: action_bar_default,
        styles: [action_bar_default2]
      })
    ], ActionBarComponent);
  }
});

// angular:jit:template:src/components/crop-image-popup/crop-image-popup.html
var crop_image_popup_default;
var init_crop_image_popup = __esm({
  "angular:jit:template:src/components/crop-image-popup/crop-image-popup.html"() {
    crop_image_popup_default = '<div class="crop-backdrop">\n    <div class="crop-container">\n        <div class="crop-header">\n            <h3>Crop Image</h3>\n            <button class="close-btn" (click)="close.emit()">\n                <mat-icon>close</mat-icon>\n            </button>\n        </div>\n\n        <div class="canvas-wrapper">\n            <canvas #canvas [width]="VIEWPORT_SIZE" [height]="VIEWPORT_SIZE" (mousedown)="onMouseDown($event)"\n                (mousemove)="onMouseMove($event)" (mouseup)="onMouseUp()" (mouseleave)="onMouseUp()"\n                (wheel)="onWheel($event)">\n            </canvas>\n            <div class="overlay-guide"></div>\n        </div>\n\n        <div class="controls">\n            <span class="zoom-icon" (click)="zoomOut()" style="cursor: pointer">\u2212</span>\n            <input type="range" min="0.1" max="5" step="0.1" [value]="scale" (input)="onZoomChange($event)">\n            <span class="zoom-icon" (click)="zoomIn()" style="cursor: pointer">+</span>\n        </div>\n\n        <div class="actions">\n            <button class="btn-cancel button" (click)="close.emit()">Cancel</button>\n            <button class="button" (click)="crop()">Save Photo</button>\n        </div>\n    </div>\n</div>\n';
  }
});

// angular:jit:style:src/components/crop-image-popup/crop-image-popup.css
var crop_image_popup_default2;
var init_crop_image_popup2 = __esm({
  "angular:jit:style:src/components/crop-image-popup/crop-image-popup.css"() {
    crop_image_popup_default2 = "/* src/components/crop-image-popup/crop-image-popup.css */\n.crop-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  animation: fadeIn 0.2s ease-out;\n}\n.crop-container {\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  padding: 24px;\n  width: 90%;\n  max-width: 400px;\n  border: var(--modal-border);\n  box-shadow: var(--modal-shadow);\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  position: relative;\n}\n.crop-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.crop-header h3 {\n  margin: 0;\n  color: var(--color-white);\n  font-size: 18px;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.canvas-wrapper {\n  position: relative;\n  width: 300px;\n  height: 300px;\n  margin: 0 auto;\n  border-radius: 12px;\n  overflow: hidden;\n  background: var(--color-gray);\n  cursor: move;\n}\n.overlay-guide {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: 1px solid var(--color-light-gray);\n  box-sizing: border-box;\n  pointer-events: none;\n  border-radius: 12px;\n}\n.controls {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  color: var(--color-light-gray);\n}\ninput[type=range] {\n  flex: 1;\n  accent-color: var(--color-accent);\n  height: 4px;\n  background: var(--color-light-gray);\n  border-radius: 2px;\n  appearance: none;\n}\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 16px;\n  height: 16px;\n  background: var(--color-white);\n  border-radius: 50%;\n  cursor: pointer;\n}\n.actions {\n  display: flex;\n  justify-content: center;\n  gap: 12px;\n  margin-top: 10px;\n}\n.btn-cancel {\n  height: auto;\n  border: 1px solid var(--color-light-gray);\n  background: var(--color-dark-gray);\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n/*# sourceMappingURL=crop-image-popup.css.map */\n";
  }
});

// src/components/crop-image-popup/crop-image-popup.ts
var CropImagePopup;
var init_crop_image_popup3 = __esm({
  "src/components/crop-image-popup/crop-image-popup.ts"() {
    "use strict";
    init_tslib_es6();
    init_crop_image_popup();
    init_crop_image_popup2();
    init_core();
    init_common();
    init_icon();
    CropImagePopup = class CropImagePopup2 {
      imageFile;
      close = new EventEmitter();
      imageCropped = new EventEmitter();
      canvasRef;
      ctx;
      image = new Image();
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      isDragging = false;
      lastX = 0;
      lastY = 0;
      VIEWPORT_SIZE = 300;
      OUTPUT_SIZE = 128;
      ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext("2d");
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image.src = e.target.result;
          this.image.onload = () => {
            this.resetView();
            this.draw();
          };
        };
        reader.readAsDataURL(this.imageFile);
      }
      resetView() {
        const scaleX = this.VIEWPORT_SIZE / this.image.width;
        const scaleY = this.VIEWPORT_SIZE / this.image.height;
        this.scale = Math.max(scaleX, scaleY);
        this.offsetX = (this.VIEWPORT_SIZE - this.image.width * this.scale) / 2;
        this.offsetY = (this.VIEWPORT_SIZE - this.image.height * this.scale) / 2;
      }
      draw() {
        if (!this.ctx)
          return;
        this.ctx.clearRect(0, 0, this.VIEWPORT_SIZE, this.VIEWPORT_SIZE);
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.VIEWPORT_SIZE, this.VIEWPORT_SIZE);
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.drawImage(this.image, 0, 0);
        this.ctx.restore();
      }
      onMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      }
      onMouseMove(e) {
        if (!this.isDragging)
          return;
        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;
        this.offsetX += deltaX;
        this.offsetY += deltaY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.draw();
      }
      onMouseUp() {
        this.isDragging = false;
      }
      onWheel(e) {
        e.preventDefault();
        const zoomSpeed = 1e-3;
        const newScale = this.scale - e.deltaY * zoomSpeed;
        if (newScale > 0.1) {
          this.scale = newScale;
          this.draw();
        }
      }
      onZoomChange(event) {
        this.scale = parseFloat(event.target.value);
        this.draw();
      }
      zoomIn() {
        this.scale = Math.min(this.scale + 0.1, 5);
        this.draw();
      }
      zoomOut() {
        this.scale = Math.max(this.scale - 0.1, 0.1);
        this.draw();
      }
      crop() {
        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = this.OUTPUT_SIZE;
        outputCanvas.height = this.OUTPUT_SIZE;
        const outputCtx = outputCanvas.getContext("2d");
        const sourceX = (0 - this.offsetX) / this.scale;
        const sourceY = (0 - this.offsetY) / this.scale;
        const sourceWidth = this.VIEWPORT_SIZE / this.scale;
        const sourceHeight = this.VIEWPORT_SIZE / this.scale;
        outputCtx.drawImage(this.image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, this.OUTPUT_SIZE, this.OUTPUT_SIZE);
        outputCanvas.toBlob((blob) => {
          if (blob) {
            this.imageCropped.emit(blob);
          }
        }, "image/jpeg", 0.9);
      }
      static propDecorators = {
        imageFile: [{ type: Input }],
        close: [{ type: Output }],
        imageCropped: [{ type: Output }],
        canvasRef: [{ type: ViewChild, args: ["canvas", { static: false }] }]
      };
    };
    CropImagePopup = __decorate([
      Component({
        selector: "CropImagePopup",
        standalone: true,
        imports: [CommonModule, MatIconModule],
        template: crop_image_popup_default,
        styles: [crop_image_popup_default2]
      })
    ], CropImagePopup);
  }
});

// angular:jit:template:src/components/create-event-popup/create-event-popup.html
var create_event_popup_default;
var init_create_event_popup = __esm({
  "angular:jit:template:src/components/create-event-popup/create-event-popup.html"() {
    create_event_popup_default = `<div class="backdrop" (click)="onClose()"></div>

<div class="popup-container desktop">
    <div class="popup-content">
        <div class="mobile-header">
            <mat-icon (click)="onClose()">arrow_back</mat-icon>
            <h1>Create Event</h1>
        </div>

        <button class="close-btn close tablet-desktop-only" (click)="onClose()">
            <mat-icon>close</mat-icon>
        </button>

        <div class="header desktop-header">
            <h1>Create Event</h1>
            @if(generalError) {
            <p class="error">{{ generalError }}</p>
            } @else if ((errors | keyvalue).length > 0) {
            <p class="error">{{ (errors | keyvalue)[0].value }}</p>
            }
        </div>

        <form class="form">
            <div class="two-column single-column">
                <FormField [error]="hasError('title')" [control]="$any(form.get('title'))" [type]="'text'"
                    placeholder="Title" />
            </div>

            <FormField [error]="hasError('description')" [control]="$any(form.get('description'))" [type]="'textarea'"
                placeholder="Description" customClass="tall-field" />

            <div class="two-column">
                <FormField [error]="hasError('date')" [control]="$any(form.get('date'))" [type]="'date'"
                    placeholder="From" />
                <FormField [error]="hasError('endDate')" [control]="$any(form.get('endDate'))" [type]="'date'"
                    placeholder="To" />
            </div>

            <div class="two-column">
                <FormField [error]="hasError('startTime')" [control]="$any(form.get('startTime'))" [type]="'time'"
                    placeholder="Start" />
                <FormField [error]="hasError('endTime')" [control]="$any(form.get('endTime'))" [type]="'time'"
                    placeholder="End" />
            </div>

            <div class="two-column">
                <FormField [error]="hasError('nPartecipants')" [control]="$any(form.get('nPartecipants'))"
                    [type]="'number'" placeholder="Max Participants" />
                <FormField [error]="hasError('costPerPerson')" [control]="$any(form.get('costPerPerson'))"
                    [type]="'number'" [min]="0" placeholder="Cost (\u20AC)" />
            </div>

            <button type="button" class="button location-btn" (click)="selectLocationOnMap()">
                \u{1F4CD} {{ locationText }}
            </button>

            <button type="button" class="button" (click)="onSubmit()">Create Event</button>
        </form>
    </div>
</div>
`;
  }
});

// angular:jit:style:src/components/create-event-popup/create-event-popup.css
var create_event_popup_default2;
var init_create_event_popup2 = __esm({
  "angular:jit:style:src/components/create-event-popup/create-event-popup.css"() {
    create_event_popup_default2 = "/* src/components/create-event-popup/create-event-popup.css */\n.backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: var(--z-backdrop);\n}\n.popup-container.desktop {\n  position: fixed;\n  inset: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: var(--z-popup);\n}\n.popup-container.desktop .popup-content {\n  position: relative;\n  align-items: center;\n  width: 45%;\n  max-height: 95vh;\n  background: var(--modal-surface);\n  border-radius: var(--modal-radius);\n  border: var(--modal-border);\n  display: flex;\n  flex-direction: column;\n  overflow: visible;\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.close {\n  position: absolute;\n  top: 20px;\n  right: 20px;\n}\n.header {\n  padding: 20px 0 10px 0;\n  text-align: center;\n  width: 100%;\n}\n.form {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-lg);\n  padding: 0 8% 24px;\n  box-sizing: border-box;\n}\n.form > * {\n  width: 100%;\n}\n.two-column {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: var(--spacing-md);\n  width: 100%;\n}\n.single-column {\n  grid-template-columns: 1fr;\n}\n.three-column {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: var(--spacing-md);\n  width: 100%;\n}\n.tall-field {\n  min-height: 80px;\n}\n.tall-field > * {\n  height: 100%;\n}\n.description-row {\n  width: 100%;\n  min-height: 80px;\n}\n.description-row > * {\n  height: 100%;\n}\n.time-section {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-sm);\n}\n.section-label {\n  font-size: 14px;\n  font-weight: var(--font-weight-semibold);\n  color: var(--color-light-gray);\n  margin: 0;\n}\n.time-inputs {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-md);\n  width: 100%;\n}\n.time-inputs > * {\n  flex: 1;\n}\n.time-separator {\n  font-size: 18px;\n  color: var(--color-light-gray);\n  padding: 0 var(--spacing-xs);\n}\n.location-section {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-sm);\n  width: 100%;\n}\n.location-btn {\n  background-color: var(--color-gray);\n  width: 100%;\n  border: 2px solid rgba(255, 255, 255, 0.12);\n  box-sizing: border-box;\n}\n.location-btn:hover {\n  filter: brightness(1.2);\n}\n.error {\n  color: var(--color-error);\n  font-size: 18px;\n  margin: 0;\n}\n.mobile-back,\n.mobile-header {\n  display: none;\n}\n@media (max-width: 767px) {\n  .popup-container.desktop {\n    width: 100vw;\n    height: 100vh;\n    max-width: none;\n    max-height: none;\n    border-radius: 0;\n    inset: 0;\n    z-index: var(--z-popup);\n  }\n  .popup-container.desktop .popup-content {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    max-width: none;\n    max-height: none;\n    border-radius: 0;\n    border: none;\n    justify-content: flex-start;\n    background: var(--modal-surface);\n    overflow-y: auto;\n  }\n  .three-column {\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    gap: var(--spacing-md);\n  }\n  .form-field input,\n  .form-field select,\n  .form-field textarea {\n    min-height: 50px;\n    font-size: 18px;\n  }\n  .button {\n    height: 60px;\n    font-size: 16px;\n  }\n  .close,\n  .desktop-header,\n  .mobile-back {\n    display: none;\n  }\n  .mobile-header {\n    display: flex;\n  }\n  .form {\n    background:\n      linear-gradient(\n        160deg,\n        rgba(20, 20, 20, 0.96),\n        rgba(12, 12, 12, 0.98));\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    gap: var(--spacing-lg);\n    padding: 0 10%;\n    height: 100%;\n  }\n  .two-column {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    box-sizing: border-box;\n  }\n  .two-column > * {\n    min-width: 0;\n  }\n  .two-column.single-column {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=create-event-popup.css.map */\n";
  }
});

// src/components/create-event-popup/create-event-popup.ts
var CreateEventPopup;
var init_create_event_popup3 = __esm({
  "src/components/create-event-popup/create-event-popup.ts"() {
    "use strict";
    init_tslib_es6();
    init_create_event_popup();
    init_create_event_popup2();
    init_core();
    init_common();
    init_forms();
    init_form_field();
    init_http();
    init_icon();
    init_mapbox_service();
    CreateEventPopup = class CreateEventPopup2 {
      fb;
      http;
      mapboxService;
      close = new EventEmitter();
      eventCreated = new EventEmitter();
      openLocationSelector = new EventEmitter();
      form;
      generalError = "";
      errors = {};
      latitude = null;
      longitude = null;
      locationText = "Select position on map";
      selectedCity = null;
      constructor(fb, http, mapboxService) {
        this.fb = fb;
        this.http = http;
        this.mapboxService = mapboxService;
        this.form = this.fb.group({
          title: ["", Validators.required],
          description: ["", Validators.required],
          date: ["", Validators.required],
          endDate: [""],
          startTime: ["", Validators.required],
          endTime: [""],
          nPartecipants: ["", [Validators.required, Validators.min(1)]],
          costPerPerson: ["", [Validators.min(0)]]
        }, { validators: this.timeRangeValidator });
      }
      timeRangeValidator(group) {
        const start = group.get("startTime")?.value;
        const end = group.get("endTime")?.value;
        if (start && end) {
          const [h1, m1] = start.split(":").map(Number);
          const [h2, m2] = end.split(":").map(Number);
          const startMinutes = h1 * 60 + m1;
          const endMinutes = h2 * 60 + m2;
          if (endMinutes <= startMinutes) {
            return { timeOrder: true };
          }
          if (endMinutes - startMinutes < 60) {
            return { minDuration: true };
          }
        }
        return null;
      }
      onClose() {
        this.close.emit();
      }
      submitAttempted = false;
      hasError(field) {
        const control = this.form.get(field);
        const isTimeField = field === "startTime" || field === "endTime";
        const hasTimeError = this.form.errors?.["timeOrder"] || this.form.errors?.["minDuration"];
        return !!(this.submitAttempted && (control?.invalid || isTimeField && hasTimeError));
      }
      selectLocationOnMap() {
        this.openLocationSelector.emit();
      }
      setLocation(lat, lng) {
        this.latitude = lat;
        this.longitude = lng;
        this.selectedCity = null;
        this.locationText = "Location selected";
        this.mapboxService.reverseGeocode(lat, lng).subscribe({
          next: (city) => {
            if (!city)
              return;
            this.selectedCity = city;
            this.locationText = `Location: ${city}`;
          },
          error: (err) => console.error("Error reverse geocoding city", err)
        });
      }
      onSubmit() {
        this.submitAttempted = true;
        this.errors = {};
        this.generalError = "";
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key)?.markAsTouched();
        });
        const controls = this.form.controls;
        if (controls["title"].invalid)
          this.errors.title = "Title is required.";
        if (controls["description"].invalid)
          this.errors.description = "Description is required.";
        if (controls["date"].invalid)
          this.errors.date = "Date is required.";
        if (controls["startTime"].invalid)
          this.errors.startTime = "Start time is required.";
        if (controls["nPartecipants"].invalid) {
          if (controls["nPartecipants"].errors?.["required"]) {
            this.errors.nPartecipants = "Number of participants is required.";
          } else if (controls["nPartecipants"].errors?.["min"]) {
            this.errors.nPartecipants = "Number of participants must be at least 1.";
          }
        }
        if (controls["costPerPerson"].invalid) {
          if (controls["costPerPerson"].errors?.["min"]) {
            this.errors.costPerPerson = "Cost cannot be negative.";
          } else {
            this.errors.costPerPerson = "Invalid cost.";
          }
        }
        if (this.form.errors?.["timeOrder"]) {
          this.errors.time = "Start time must be before end time.";
        } else if (this.form.errors?.["minDuration"]) {
          this.errors.time = "Event must last at least one hour.";
        }
        if (this.latitude === null || this.longitude === null) {
          this.errors.location = "Select a location on the map.";
        } else if (!this.selectedCity) {
          this.errors.location = "Unable to detect city from selected location.";
        }
        if (Object.keys(this.errors).length > 0) {
          return;
        }
        const formValue = this.form.value;
        const eventData = {
          title: formValue.title,
          description: formValue.description,
          city: this.selectedCity,
          date: formValue.date,
          endDate: formValue.endDate || null,
          startTime: formValue.startTime,
          endTime: formValue.endTime,
          nPartecipants: parseInt(formValue.nPartecipants),
          costPerPerson: formValue.costPerPerson !== null && formValue.costPerPerson !== "" ? Math.max(0, parseFloat(formValue.costPerPerson)) : null,
          latitude: this.latitude,
          longitude: this.longitude
        };
        const userJson = localStorage.getItem("user");
        const userId = userJson ? JSON.parse(userJson).id : null;
        this.http.post(`http://localhost:8080/api/events?userId=${userId}`, eventData).subscribe({
          next: (response) => {
            this.eventCreated.emit(response);
            this.onClose();
          },
          error: (err) => {
            console.error("Error creating event:", err);
            this.generalError = "Error creating event";
          }
        });
      }
      static ctorParameters = () => [
        { type: FormBuilder },
        { type: HttpClient },
        { type: MapboxService }
      ];
      static propDecorators = {
        close: [{ type: Output }],
        eventCreated: [{ type: Output }],
        openLocationSelector: [{ type: Output }]
      };
    };
    CreateEventPopup = __decorate([
      Component({
        selector: "create-event-popup",
        standalone: true,
        imports: [CommonModule, FormField, ReactiveFormsModule, MatIconModule],
        template: create_event_popup_default,
        styles: [create_event_popup_default2]
      })
    ], CreateEventPopup);
  }
});

// angular:jit:template:src/components/event-popup-card/event-popup-card.html
var event_popup_card_default;
var init_event_popup_card = __esm({
  "angular:jit:template:src/components/event-popup-card/event-popup-card.html"() {
    event_popup_card_default = `<div class="card-container">
  <div class="card-content">
    <div class="header-row">
      <div class="title-block">
        <h1 class="title">{{ event.title }}</h1>
        @if (event.city) {
        <p class="subtitle">
          <mat-icon class="inline-icon">place</mat-icon>
          <span>{{ event.city }}</span>
        </p>
        } @else {
        <p class="subtitle">{{ getSubtitle() }}</p>
        }
        <p class="accent-date">
          <mat-icon class="inline-icon">event</mat-icon>
          <span>{{ formatHeroDate() }}</span>
        </p>
      </div>
      <div class="action-icons">
        @if (hasCoordinates()) {
        <button type="button" class="action-icon map-icon" (click)="openInMaps($event)"
          aria-label="Open in Google Maps">
          <mat-icon>map</mat-icon>
        </button>
        }
        @if (!event.isParticipating) {
        <button class="action-icon favorite-icon" [class.saved]="isSaved()"
          (click)="toggleFavorite.emit(); $event.stopPropagation()" aria-label="Save event">
          <mat-icon>{{ isSaved() ? 'favorite' : 'favorite_border' }}</mat-icon>
          @if (event.savedCount !== undefined && event.savedCount !== null) {
          <span class="favorite-count">{{ event.savedCount }}</span>
          }
        </button>
        }
        <button class="action-icon share-icon" (click)="shareEvent.emit(event); $event.stopPropagation()"
          aria-label="Share event">
          <mat-icon>share</mat-icon>
        </button>
        @if (currentUserId && !isOrganizer()) {
        <button class="action-icon report-icon" (click)="openReportModal(); $event.stopPropagation()"
          aria-label="Report event">
          <mat-icon>flag</mat-icon>
        </button>
        }
      </div>
    </div>

    <div class="chip-row">
      <span class="chip">
        <mat-icon>group</mat-icon>
        <span>{{ getActualParticipants() }} participants</span>
      </span>
      <span class="chip" *ngIf="event.occupiedSpots !== undefined">
        <mat-icon>event_available</mat-icon>
        <span>{{ event.nPartecipants - (event.occupiedSpots || 0) }} spots left</span>
      </span>
      <span class="chip">
        <mat-icon>euro</mat-icon>
        <span>{{ formatCost() }}</span>
      </span>
    </div>

    <p class="description" *ngIf="showDescription()">{{ event.description }}</p>

    <div class="eventer-section">
      <div class="eventer-info">
        <button class="eventer-hit" type="button" (click)="onOrganizerClick(); $event.stopPropagation()">
          @if (organizerImage) {
          <img [src]="organizerImage" alt="Eventer" class="organizer-avatar">
          } @else {
          <div class="organizer-avatar placeholder">{{ getInitials(organizerName) }}</div>
          }
          <div class="eventer-text">
            <span class="eventer-label">Eventer</span>
            <span class="eventer-name">{{ organizerName }}</span>
          </div>
        </button>
      </div>

      @if (currentUserId && (creatorId || event.creatorId)) {
      @if (currentUserId.toString() === (creatorId || event.creatorId)?.toString()) {
      <span class="is-organizer-badge">You</span>
      } @else {
      @if (!isFollowing && !isLoadingFollowStatus) {
      <button class="icon-circle follow-btn-popup" (click)="followOrganizer(); $event.stopPropagation()">
        <mat-icon>person_add</mat-icon>
      </button>
      } @else if (isFollowing) {
      <div class="notify-toggle">
        <button class="icon-circle bell-btn" [class.active]="notificationsEnabled" [disabled]="notificationsLoading"
          (click)="toggleNotifications($event)">
          <mat-icon>{{ notificationsEnabled ? 'notifications' : 'notifications_off' }}</mat-icon>
        </button>
      </div>
      }
      }
      }
    </div>

    @if (isOrganizer()) {
    <div class="owner-note">You cannot join your own event</div>
    <button class="button cancel-btn" type="button" (click)="onDeleteEvent()">Delete event</button>
    } @else {
    @if (event.participationStatus === 'ACCEPTED') {
    <div class="participation-actions">
      <button class="button partecipa-btn accepted" disabled>Joined</button>
      <button class="button chat-btn" type="button" (click)="onOpenChat()">Chat</button>
      <button class="button leave-btn" type="button" (click)="onLeave()">Leave</button>
    </div>
    } @else if (event.participationStatus === 'PENDING') {
    <button class="button partecipa-btn pending" disabled>Pending</button>
    } @else {
    <button class="button partecipa-btn" (click)="onParticipate()">Request to join</button>
    }
    }
  </div>
</div>

@if (showReportModal && event) {
<app-report-modal [reporterId]="currentUserId" [targetType]="'EVENT'" [targetId]="event.id ? event.id.toString() : null"
  [targetLabel]="event.title" (close)="closeReportModal()" (submitted)="closeReportModal()">
</app-report-modal>
}
`;
  }
});

// angular:jit:style:src/components/event-popup-card/event-popup-card.css
var event_popup_card_default2;
var init_event_popup_card2 = __esm({
  "angular:jit:style:src/components/event-popup-card/event-popup-card.css"() {
    event_popup_card_default2 = "/* src/components/event-popup-card/event-popup-card.css */\n.card-container {\n  position: absolute;\n  z-index: 900;\n  pointer-events: none;\n}\n.card-content {\n  position: relative;\n  width: 380px;\n  max-width: calc(100vw - 32px);\n  background:\n    radial-gradient(\n      circle at 15% 20%,\n      rgba(252, 195, 36, 0.18),\n      transparent 34%),\n    linear-gradient(\n      160deg,\n      #1a1a1a 0%,\n      #101010 55%,\n      #060606 100%);\n  border-radius: 18px;\n  padding: 22px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  pointer-events: all;\n  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  color: #f7f7f7;\n  white-space: normal;\n}\n.header-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 10px 12px;\n  flex-wrap: wrap;\n}\n.title-block {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  flex: 1 1 220px;\n  min-width: 0;\n  padding-top: 54px;\n}\n.title {\n  margin: 0;\n  font-size: 32px;\n  font-weight: var(--font-weight-bold);\n  color: var(--color-white);\n  line-height: 1.05;\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n  word-break: break-word;\n  overflow-wrap: anywhere;\n}\n.subtitle {\n  margin: 0;\n  font-size: 18px;\n  font-weight: var(--font-weight-regular);\n  color: #e7e7e7;\n  line-height: 1.3;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.inline-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: var(--color-accent);\n}\n.accent-date {\n  margin: 2px 0 6px;\n  font-size: 18px;\n  font-weight: var(--font-weight-bold);\n  color: var(--color-accent);\n  text-transform: lowercase;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.action-icons {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  position: absolute;\n  top: 16px;\n  right: 16px;\n  flex-wrap: nowrap;\n  justify-content: flex-end;\n}\n.action-icon {\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  background: rgba(255, 255, 255, 0.07);\n  border-radius: 14px;\n  width: 42px;\n  height: 42px;\n  display: grid;\n  place-items: center;\n  color: #d8d8d8;\n  cursor: pointer;\n  transition:\n    transform 0.15s ease,\n    box-shadow 0.15s ease,\n    border-color 0.15s ease,\n    background-color 0.15s ease;\n}\n.favorite-icon {\n  position: relative;\n}\n.favorite-count {\n  position: absolute;\n  top: 2px;\n  right: 2px;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 999px;\n  background: rgba(12, 12, 12, 0.9);\n  border: 1px solid rgba(255, 255, 255, 0.22);\n  color: var(--color-accent);\n  font-size: 9px;\n  font-weight: var(--font-weight-bold);\n  display: grid;\n  place-items: center;\n  line-height: 1;\n}\n.action-icon:hover {\n  transform: translateY(-1px);\n  border-color: rgba(255, 255, 255, 0.2);\n  background: rgba(255, 255, 255, 0.1);\n}\n.favorite-icon.saved {\n  color: var(--color-accent);\n  border-color: rgba(252, 195, 36, 0.6);\n  box-shadow: 0 0 12px rgba(252, 195, 36, 0.28);\n}\n.action-icon mat-icon {\n  font-size: 22px;\n  width: 22px;\n  height: 22px;\n}\n.report-icon {\n  color: #ff8b8b;\n}\n.report-icon:hover {\n  border-color: rgba(255, 139, 139, 0.5);\n  background: rgba(255, 139, 139, 0.12);\n}\n.brand-pill {\n  align-self: flex-start;\n  padding: 6px 10px;\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.14);\n  color: var(--color-accent);\n  font-weight: var(--font-weight-bold);\n  font-size: 12px;\n  letter-spacing: 0.8px;\n}\n.chip-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin: 8px 0 6px;\n}\n.chip {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 10px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 999px;\n  color: #f5f5f5;\n  font-size: 11px;\n  line-height: 1.2;\n}\n.chip mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--color-accent);\n}\n.description {\n  margin: 6px 0 8px;\n  font-size: 15px;\n  font-weight: var(--font-weight-light);\n  color: #e6e6e6;\n  line-height: 1.6;\n}\n.eventer-section {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-top: 6px;\n}\n.eventer-info {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.eventer-hit {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  padding: 0;\n  border-radius: 0;\n  border: none;\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n  transition: opacity 0.15s ease;\n}\n.eventer-hit:hover {\n  opacity: 0.8;\n}\n.organizer-avatar {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n}\n.organizer-avatar.placeholder {\n  background: rgba(255, 255, 255, 0.1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 16px;\n  font-weight: var(--font-weight-semibold);\n  color: var(--color-white);\n}\n.eventer-text {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  align-items: flex-start;\n  text-align: left;\n}\n.eventer-label {\n  font-size: 11px;\n  font-weight: var(--font-weight-regular);\n  color: #c7c7c7;\n  letter-spacing: 0.6px;\n  text-transform: uppercase;\n}\n.eventer-name {\n  font-size: 14px;\n  font-weight: var(--font-weight-semibold);\n  color: var(--color-white);\n}\n.is-organizer-badge {\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: rgba(252, 195, 36, 0.18);\n  border: 1px solid rgba(252, 195, 36, 0.5);\n  color: #f8f1d2;\n  font-weight: var(--font-weight-semibold);\n  font-size: 12px;\n}\n.icon-circle {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-color: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  transition:\n    transform 0.15s ease,\n    background-color 0.15s ease,\n    border-color 0.15s ease;\n}\n.icon-circle:hover {\n  background-color: rgba(255, 255, 255, 0.14);\n  border-color: rgba(255, 255, 255, 0.2);\n}\n.icon-circle:active {\n  transform: scale(0.94);\n}\n.icon-circle mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  color: #f0f0f0;\n}\n.follow-btn-popup.following {\n  background-color: var(--color-accent);\n  color: #0b0b0b;\n  border-color: var(--color-accent);\n}\n.partecipa-btn {\n  width: 100%;\n  margin-top: 16px;\n  background: var(--color-accent);\n  color: var(--color-white);\n  font-weight: var(--font-weight-bold);\n  border: none;\n  border-radius: 12px;\n  padding: 10px 16px;\n  font-size: 15px;\n  letter-spacing: 0.3px;\n  box-shadow: 0 8px 18px rgba(252, 195, 36, 0.25);\n  transition: filter 0.15s ease, transform 0.1s ease;\n}\n.partecipa-btn:hover {\n  filter: brightness(1.05);\n}\n.partecipa-btn:active {\n  transform: translateY(1px);\n}\n.partecipa-btn.pending {\n  background-color: #ffb84d;\n  color: #ffffff;\n  opacity: 0.95;\n}\n.partecipa-btn.accepted {\n  background-color: #4caf50;\n  color: #fff;\n  opacity: 0.95;\n}\n.partecipa-btn:disabled {\n  pointer-events: none;\n}\n.participation-actions {\n  display: flex;\n  gap: 10px;\n  margin-top: 16px;\n}\n.participation-actions .partecipa-btn {\n  width: auto;\n  margin-top: 0;\n  flex: 1 1 auto;\n}\n.chat-btn {\n  flex: 0 0 auto;\n  margin-top: 0;\n  padding: 10px 14px;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  background: rgba(255, 255, 255, 0.08);\n  color: #f7f7f7;\n  font-weight: var(--font-weight-semibold);\n  letter-spacing: 0.2px;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    transform 0.1s ease;\n}\n.chat-btn:hover {\n  background: rgba(255, 255, 255, 0.12);\n  border-color: rgba(255, 255, 255, 0.3);\n}\n.chat-btn:active {\n  transform: translateY(1px);\n}\n.leave-btn {\n  flex: 0 0 auto;\n  margin-top: 0;\n  padding: 10px 14px;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  background: transparent;\n  color: #f7f7f7;\n  font-weight: var(--font-weight-semibold);\n  letter-spacing: 0.2px;\n  transition:\n    background-color 0.15s ease,\n    border-color 0.15s ease,\n    transform 0.1s ease;\n}\n.leave-btn:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.leave-btn:active {\n  transform: translateY(1px);\n}\n.owner-note {\n  margin-top: 16px;\n  padding: 12px 14px;\n  border-radius: 10px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  color: #f0f0f0;\n  font-weight: var(--font-weight-semibold);\n  font-size: 14px;\n}\n.notify-toggle {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.bell-btn {\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}\n.bell-btn.active {\n  background: rgba(251, 188, 4, 0.16);\n  border-color: var(--color-accent);\n}\n.bell-btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.notify-label {\n  font-size: 12px;\n  color: #cfcfcf;\n}\n.cancel-btn {\n  width: 100%;\n  margin-top: 10px;\n  background: #b61e1e;\n  color: #fff;\n  font-weight: var(--font-weight-semibold);\n  border: none;\n  border-radius: 12px;\n  padding: 10px 14px;\n  letter-spacing: 0.2px;\n  box-shadow: 0 8px 18px rgba(182, 30, 30, 0.35);\n  transition: filter 0.15s ease, transform 0.1s ease;\n}\n.cancel-btn:hover {\n  filter: brightness(1.05);\n}\n.cancel-btn:active {\n  transform: translateY(1px);\n}\n@media (max-width: 480px) {\n  .card-content {\n    width: calc(100vw - 24px);\n    padding: 18px;\n  }\n  .title-block {\n    padding-top: 0;\n    padding-right: 0;\n  }\n  .action-icons {\n    position: static;\n    flex-wrap: wrap;\n    justify-content: flex-start;\n  }\n  .title {\n    font-size: 26px;\n  }\n  .subtitle,\n  .accent-date {\n    font-size: 16px;\n  }\n}\n/*# sourceMappingURL=event-popup-card.css.map */\n";
  }
});

// angular:jit:template:src/components/report-modal/report-modal.component.html
var report_modal_component_default;
var init_report_modal_component = __esm({
  "angular:jit:template:src/components/report-modal/report-modal.component.html"() {
    report_modal_component_default = `<div class="report-backdrop" (click)="onClose()">
    <div class="report-modal" (click)="$event.stopPropagation()">
        <div class="report-header">
            <div>
                <h3>Report {{ targetType === 'USER' ? 'user' : 'event' }}</h3>
                @if (targetLabel) {
                <p class="target-line">You are reporting: <strong>{{ targetLabel }}</strong></p>
                }
            </div>
            <button class="icon-btn" type="button" (click)="onClose()">
                <mat-icon>close</mat-icon>
            </button>
        </div>

        <div class="report-body">
            <label class="field-label">Main reason</label>
            <input class="field-input" type="text" [(ngModel)]="reason"
                placeholder="E.g. Offensive language, scam, inappropriate behavior">

            <label class="field-label">Details (optional)</label>
            <textarea class="field-input field-textarea" rows="4" [(ngModel)]="details"
                placeholder="Add any other helpful details..."></textarea>

            <label class="field-label">Image (optional)</label>
            <div class="file-row">
                <input class="file-input" type="file" accept="image/*" (change)="onFileSelected($event)">
                @if (imageName) {
                <div class="file-chip">
                    <span>{{ imageName }}</span>
                    <button type="button" class="file-remove" (click)="clearImage()">
                        <mat-icon>close</mat-icon>
                    </button>
                </div>
                }
            </div>
        </div>

        <div class="report-actions">
            <button class="button secondary" type="button" (click)="onClose()">Cancel</button>
            <button class="button" type="button" (click)="submitReport()" [disabled]="isSubmitting || !reason.trim()">
                {{ isSubmitting ? 'Sending...' : 'Submit report' }}
            </button>
        </div>
    </div>
</div>
`;
  }
});

// angular:jit:style:src/components/report-modal/report-modal.component.css
var report_modal_component_default2;
var init_report_modal_component2 = __esm({
  "angular:jit:style:src/components/report-modal/report-modal.component.css"() {
    report_modal_component_default2 = "/* src/components/report-modal/report-modal.component.css */\n.report-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.7);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 2000;\n  padding: 24px;\n}\n.report-modal {\n  background: rgba(20, 20, 20, 0.95);\n  color: #fff;\n  border-radius: 20px;\n  width: min(520px, 100%);\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n  border: 1px solid rgba(252, 195, 36, 0.2);\n  padding: 20px 22px;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.report-header {\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  align-items: flex-start;\n}\n.report-header h3 {\n  margin: 0;\n  font-size: 20px;\n  color: #f4c12a;\n}\n.target-line {\n  margin: 4px 0 0;\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 13px;\n}\n.icon-btn {\n  background: transparent;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n}\n.report-body {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.field-label {\n  font-size: 13px;\n  color: rgba(255, 255, 255, 0.8);\n}\n.field-input {\n  width: 100%;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  background: rgba(255, 255, 255, 0.08);\n  color: #fff;\n  padding: 10px 12px;\n  font-size: 14px;\n  outline: none;\n}\n.field-input:focus {\n  border-color: rgba(252, 195, 36, 0.6);\n}\n.field-textarea {\n  resize: vertical;\n  min-height: 96px;\n}\n.file-row {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.file-input {\n  width: 100%;\n  color: rgba(255, 255, 255, 0.8);\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 12px;\n  padding: 6px 8px;\n  font-size: 14px;\n  outline: none;\n}\n.file-input:focus {\n  border-color: rgba(252, 195, 36, 0.6);\n}\n.file-input::file-selector-button,\n.file-input::-webkit-file-upload-button {\n  margin-right: 12px;\n  border: none;\n  background-color: var(--color-accent, #f4c12a);\n  color: #fff;\n  padding: 8px 14px;\n  border-radius: 10px;\n  font-weight: 700;\n  font-family: inherit;\n  cursor: pointer;\n  transition: transform 0.2s, opacity 0.2s;\n}\n.file-input::file-selector-button:hover,\n.file-input::-webkit-file-upload-button:hover {\n  opacity: 0.9;\n  transform: translateY(-1px);\n}\n.file-input::file-selector-button:active,\n.file-input::-webkit-file-upload-button:active {\n  transform: translateY(0);\n}\n.file-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  background: rgba(252, 195, 36, 0.15);\n  border: 1px solid rgba(252, 195, 36, 0.4);\n  padding: 6px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.file-chip span {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 280px;\n}\n.file-remove {\n  border: none;\n  background: transparent;\n  color: #f4c12a;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n}\n.report-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n}\n@media (max-width: 600px) {\n  .report-modal {\n    padding: 18px 16px;\n  }\n}\n/*# sourceMappingURL=report-modal.component.css.map */\n";
  }
});

// src/services/report.service.ts
var ReportService;
var init_report_service = __esm({
  "src/services/report.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_http();
    ReportService = class ReportService2 {
      http;
      baseUrl = "http://localhost:8080/api";
      constructor(http) {
        this.http = http;
      }
      createReport(payload) {
        return this.http.post(`${this.baseUrl}/reports`, payload);
      }
      static ctorParameters = () => [
        { type: HttpClient }
      ];
    };
    ReportService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], ReportService);
  }
});

// src/components/report-modal/report-modal.component.ts
var ReportModalComponent;
var init_report_modal_component3 = __esm({
  "src/components/report-modal/report-modal.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_report_modal_component();
    init_report_modal_component2();
    init_core();
    init_common();
    init_forms();
    init_icon();
    init_snack_bar();
    init_report_service();
    ReportModalComponent = class ReportModalComponent2 {
      reportService;
      snackBar;
      reporterId = null;
      targetType = "USER";
      targetId = null;
      targetLabel = "";
      close = new EventEmitter();
      submitted = new EventEmitter();
      reason = "";
      details = "";
      imageFile = null;
      imageName = "";
      isSubmitting = false;
      constructor(reportService, snackBar) {
        this.reportService = reportService;
        this.snackBar = snackBar;
      }
      onClose() {
        this.close.emit();
      }
      onFileSelected(event) {
        const input = event.target;
        if (!input.files || input.files.length === 0) {
          return;
        }
        const file = input.files[0];
        this.imageFile = file;
        this.imageName = file.name;
      }
      clearImage() {
        this.imageFile = null;
        this.imageName = "";
      }
      submitReport() {
        if (!this.reporterId || !this.targetId) {
          this.showToast("You must be logged in to report.", "error");
          return;
        }
        if (!this.reason.trim()) {
          this.showToast("Please enter the main reason.", "error");
          return;
        }
        const payload = new FormData();
        payload.append("reporterId", this.reporterId);
        payload.append("targetType", this.targetType);
        payload.append("targetId", this.targetId);
        payload.append("reason", this.reason.trim());
        if (this.details.trim()) {
          payload.append("details", this.details.trim());
        }
        if (this.imageFile) {
          payload.append("image", this.imageFile, this.imageFile.name);
        }
        this.isSubmitting = true;
        this.reportService.createReport(payload).subscribe({
          next: () => {
            this.showToast("Report submitted.");
            this.isSubmitting = false;
            this.submitted.emit();
            this.onClose();
          },
          error: (err) => {
            console.error("Error submitting report", err);
            this.showToast("Unable to submit the report.", "error");
            this.isSubmitting = false;
          }
        });
      }
      showToast(message, tone = "default") {
        this.snackBar.open(message, void 0, {
          duration: tone === "error" ? 1400 : 1e3,
          horizontalPosition: "center",
          verticalPosition: "top",
          panelClass: tone === "error" ? ["toast-snackbar", "toast-snackbar--error"] : ["toast-snackbar"]
        });
      }
      static ctorParameters = () => [
        { type: ReportService },
        { type: MatSnackBar }
      ];
      static propDecorators = {
        reporterId: [{ type: Input }],
        targetType: [{ type: Input }],
        targetId: [{ type: Input }],
        targetLabel: [{ type: Input }],
        close: [{ type: Output }],
        submitted: [{ type: Output }]
      };
    };
    ReportModalComponent = __decorate([
      Component({
        selector: "app-report-modal",
        standalone: true,
        imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
        template: report_modal_component_default,
        styles: [report_modal_component_default2]
      })
    ], ReportModalComponent);
  }
});

// src/components/event-popup-card/event-popup-card.ts
var EventPopupCard;
var init_event_popup_card3 = __esm({
  "src/components/event-popup-card/event-popup-card.ts"() {
    "use strict";
    init_tslib_es6();
    init_event_popup_card();
    init_event_popup_card2();
    init_core();
    init_common();
    init_icon();
    init_user_service();
    init_report_modal_component3();
    EventPopupCard = class EventPopupCard2 {
      elementRef;
      userService;
      event;
      organizerName = "Eventer";
      organizerImage;
      eventPosition;
      currentUserId = null;
      creatorId;
      close = new EventEmitter();
      participate = new EventEmitter();
      toggleFavorite = new EventEmitter();
      openOrganizerProfile = new EventEmitter();
      leave = new EventEmitter();
      deleteEvent = new EventEmitter();
      shareEvent = new EventEmitter();
      openChat = new EventEmitter();
      isFollowing = false;
      isLoadingFollowStatus = true;
      notificationsEnabled = false;
      notificationsLoading = false;
      showReportModal = false;
      constructor(elementRef, userService) {
        this.elementRef = elementRef;
        this.userService = userService;
      }
      ngAfterViewInit() {
        this.positionCard();
      }
      ngOnChanges(changes) {
        if (changes["eventPosition"]) {
          this.positionCard();
        }
        if (changes["event"] || changes["currentUserId"] || changes["creatorId"]) {
          this.checkIfFollowing();
        }
      }
      checkIfFollowing() {
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId || this.currentUserId === targetCreatorId.toString()) {
          this.isFollowing = false;
          this.isLoadingFollowStatus = false;
          this.notificationsEnabled = false;
          return;
        }
        this.isLoadingFollowStatus = true;
        this.userService.isFollowing(this.currentUserId, targetCreatorId.toString()).subscribe({
          next: (res) => {
            this.isFollowing = res.isFollowing;
            this.isLoadingFollowStatus = false;
            if (this.isFollowing) {
              this.loadNotificationPreference(targetCreatorId.toString());
            } else {
              this.notificationsEnabled = false;
            }
          },
          error: (err) => {
            console.error("Error checking follow status", err);
            this.isLoadingFollowStatus = false;
            this.notificationsEnabled = false;
          }
        });
      }
      onClick(event) {
        event.stopPropagation();
      }
      onResize() {
        this.positionCard();
      }
      positionCard() {
        if (!this.eventPosition)
          return;
        const cardContainer = this.elementRef.nativeElement.querySelector(".card-container");
        if (cardContainer) {
          const sidebar = document.querySelector(".sidebar-container");
          const sidebarRect = sidebar?.getBoundingClientRect();
          const sidebarRight = sidebarRect && !sidebar?.classList.contains("collapsed") ? sidebarRect.right : 0;
          const baseMargin = 12;
          const leftSafeMargin = sidebarRight > 0 ? sidebarRight + baseMargin : baseMargin;
          const margin = baseMargin;
          const isMobile = window.innerWidth <= 768;
          const topSafeMargin = isMobile ? 100 : margin;
          const width = cardContainer.offsetWidth || 0;
          const height = cardContainer.offsetHeight || 0;
          const viewportW = window.innerWidth;
          const viewportH = window.innerHeight;
          const offsetY = -20;
          let x = this.eventPosition.x;
          let y = this.eventPosition.y + offsetY;
          const leftAfter = x - width / 2;
          const rightAfter = x + width / 2;
          if (leftAfter < leftSafeMargin) {
            x += leftSafeMargin - leftAfter;
          } else if (rightAfter > viewportW - margin) {
            x -= rightAfter - (viewportW - margin);
          }
          const topAfter = y - height;
          if (topAfter < topSafeMargin) {
            y += topSafeMargin - topAfter;
          }
          const actionBar = document.querySelector(".action-bar");
          const actionBarRect = actionBar?.getBoundingClientRect();
          if (actionBarRect) {
            const cardLeft = x - width / 2;
            const cardRight = x + width / 2;
            const cardTop = y - height;
            const cardBottom = y;
            const overlapsX = cardRight > actionBarRect.left - margin && cardLeft < actionBarRect.right + margin;
            const overlapsY = cardBottom > actionBarRect.top - margin && cardTop < actionBarRect.bottom + margin;
            if (overlapsX && overlapsY) {
              const desiredTop = actionBarRect.bottom + margin;
              if (cardTop < desiredTop) {
                y += desiredTop - cardTop;
              }
            }
          }
          if (y > viewportH - margin) {
            y = viewportH - margin;
          }
          cardContainer.style.left = `${x}px`;
          cardContainer.style.top = `${y}px`;
          cardContainer.style.transform = "translate(-50%, -100%)";
        }
      }
      onClose() {
        this.close.emit();
      }
      onParticipate() {
        if (this.isOrganizer())
          return;
        this.participate.emit(this.event);
      }
      onLeave() {
        this.leave.emit(this.event);
      }
      onOpenChat() {
        this.openChat.emit(this.event);
      }
      onDeleteEvent() {
        if (!this.isOrganizer())
          return;
        this.deleteEvent.emit(this.event);
      }
      toggleNotifications(event) {
        event.stopPropagation();
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId || !this.isFollowing)
          return;
        const nextValue = !this.notificationsEnabled;
        this.notificationsLoading = true;
        this.userService.setFollowNotifications(this.currentUserId, targetCreatorId.toString(), nextValue).subscribe({
          next: (res) => {
            this.notificationsEnabled = res.enabled;
            this.notificationsLoading = false;
          },
          error: (err) => {
            console.error("Error updating follow notifications", err);
            this.notificationsLoading = false;
          }
        });
      }
      isOrganizer() {
        const creatorId = this.creatorId ?? this.event?.creatorId;
        return !!this.currentUserId && !!creatorId && this.currentUserId.toString() === creatorId.toString();
      }
      getOrganizerId() {
        const rawId = this.creatorId ?? this.event?.creatorId ?? this.event?.creator?.id;
        return rawId !== void 0 && rawId !== null ? String(rawId) : null;
      }
      formatHeroDate() {
        const date = this.event.date ? /* @__PURE__ */ new Date(`${this.event.date}T00:00:00`) : null;
        const start = this.event.startTime ? this.event.startTime.slice(0, 5) : null;
        const weekday = date ? date.toLocaleDateString("en-US", { weekday: "short" }) : "";
        const dayMonth = date ? date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "";
        const datePart = [weekday, dayMonth].filter(Boolean).join(" ");
        const timePart = start ? start : "";
        return [datePart, timePart].filter(Boolean).join(", ");
      }
      getActualParticipants() {
        if (this.event.occupiedSpots !== void 0 && this.event.occupiedSpots !== null) {
          return this.event.occupiedSpots;
        }
        return this.event.nPartecipants || 0;
      }
      getSubtitle() {
        if (this.event.city)
          return this.event.city;
        if (this.event.description)
          return this.event.description;
        return "Location TBD";
      }
      hasCoordinates() {
        return !!this.event && Number.isFinite(this.event.latitude) && Number.isFinite(this.event.longitude);
      }
      openInMaps(event) {
        event?.stopPropagation();
        if (!this.hasCoordinates())
          return;
        const url = `https://www.google.com/maps/search/?api=1&query=${this.event.latitude},${this.event.longitude}`;
        window.open(url, "_blank", "noopener");
      }
      showDescription() {
        return !!this.event.description && this.event.description !== this.getSubtitle();
      }
      formatDateTime() {
        const date = this.event.date ? /* @__PURE__ */ new Date(`${this.event.date}T00:00:00`) : null;
        const start = this.event.startTime ? this.event.startTime.slice(0, 5) : null;
        const end = this.event.endTime ? this.event.endTime.slice(0, 5) : null;
        const datePart = date ? date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "";
        const timePart = end ? `${start} \u2014 ${end}` : start;
        return [datePart, timePart].filter(Boolean).join(" / ");
      }
      formatCost() {
        if (this.event.costPerPerson !== void 0 && this.event.costPerPerson !== null) {
          return `${this.event.costPerPerson} per person`;
        }
        return "Free";
      }
      getInitials(name) {
        if (!name)
          return "OR";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      isSaved() {
        return this.event.isSaved;
      }
      followOrganizer() {
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId)
          return;
        this.userService.followUser(this.currentUserId, targetCreatorId.toString()).subscribe({
          next: () => {
            this.isFollowing = true;
            this.notificationsEnabled = true;
            this.userService.notifyUserUpdate();
          },
          error: (err) => console.error("Error following", err)
        });
      }
      unfollowOrganizer() {
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId)
          return;
        this.userService.unfollowUser(this.currentUserId, targetCreatorId.toString()).subscribe({
          next: () => {
            this.isFollowing = false;
            this.notificationsEnabled = false;
            this.userService.notifyUserUpdate();
          },
          error: (err) => console.error("Error unfollowing", err)
        });
      }
      onOrganizerClick() {
        const organizerId = this.getOrganizerId();
        if (!organizerId) {
          console.log("[EventPopupCard] eventer click with missing id", {
            creatorIdInput: this.creatorId,
            eventCreatorId: this.event?.creatorId,
            event: this.event
          });
          return;
        }
        console.log("[EventPopupCard] open eventer", {
          organizerId,
          creatorIdInput: this.creatorId,
          eventCreatorId: this.event?.creatorId,
          event: this.event
        });
        this.openOrganizerProfile.emit(organizerId);
      }
      openReportModal() {
        if (!this.currentUserId || this.isOrganizer())
          return;
        this.showReportModal = true;
      }
      closeReportModal() {
        this.showReportModal = false;
      }
      loadNotificationPreference(targetCreatorId) {
        if (!this.currentUserId)
          return;
        this.notificationsLoading = true;
        this.userService.getFollowNotifications(this.currentUserId, targetCreatorId).subscribe({
          next: (res) => {
            this.notificationsEnabled = !!res.enabled;
            this.notificationsLoading = false;
          },
          error: (err) => {
            console.error("Error fetching follow notifications preference", err);
            this.notificationsEnabled = false;
            this.notificationsLoading = false;
          }
        });
      }
      static ctorParameters = () => [
        { type: ElementRef },
        { type: UserService }
      ];
      static propDecorators = {
        event: [{ type: Input }],
        organizerName: [{ type: Input }],
        organizerImage: [{ type: Input }],
        eventPosition: [{ type: Input }],
        currentUserId: [{ type: Input }],
        creatorId: [{ type: Input }],
        close: [{ type: Output }],
        participate: [{ type: Output }],
        toggleFavorite: [{ type: Output }],
        openOrganizerProfile: [{ type: Output }],
        leave: [{ type: Output }],
        deleteEvent: [{ type: Output }],
        shareEvent: [{ type: Output }],
        openChat: [{ type: Output }],
        onClick: [{ type: HostListener, args: ["click", ["$event"]] }],
        onResize: [{ type: HostListener, args: ["window:resize"] }]
      };
    };
    EventPopupCard = __decorate([
      Component({
        selector: "event-popup-card",
        standalone: true,
        imports: [CommonModule, MatIconModule, ReportModalComponent],
        template: event_popup_card_default,
        styles: [event_popup_card_default2]
      })
    ], EventPopupCard);
  }
});

// angular:jit:template:src/components/map-location-selector/map-location-selector.html
var map_location_selector_default;
var init_map_location_selector = __esm({
  "angular:jit:template:src/components/map-location-selector/map-location-selector.html"() {
    map_location_selector_default = `<div class="backdrop" (click)="onClose()"></div>

<div class="selector-container">
    <div class="instruction-text">
        \u{1F4CD} Select a location for your event
    </div>

    <div class="search-section">
        <div class="search-bar">
            <mat-icon>search</mat-icon>
            <input type="text" placeholder="Search city or place..." [(ngModel)]="searchQuery" (input)="onSearch()">
            @if (searchQuery) {
            <mat-icon class="clear-icon" (click)="searchQuery = ''; cityResults = []">close</mat-icon>
            }
        </div>

        @if (cityResults.length > 0) {
        <div class="search-results">
            @for (city of cityResults; track city.name) {
            <div class="result-item" (click)="selectCity(city)">
                <mat-icon>location_on</mat-icon>
                <span>{{ city.name }}</span>
            </div>
            }
        </div>
        }
    </div>

    <div id="location-map" class="map"></div>

    <button class="button confirm-btn" (click)="onConfirm()" [disabled]="!selectedCoords">
        Confirm Location
    </button>
</div>`;
  }
});

// angular:jit:style:src/components/map-location-selector/map-location-selector.css
var map_location_selector_default2;
var init_map_location_selector2 = __esm({
  "angular:jit:style:src/components/map-location-selector/map-location-selector.css"() {
    map_location_selector_default2 = "/* src/components/map-location-selector/map-location-selector.css */\n.backdrop {\n  position: fixed;\n  inset: 0;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  z-index: var(--z-backdrop);\n}\n.selector-container {\n  position: fixed;\n  inset: 0;\n  z-index: var(--z-popup);\n  pointer-events: none;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 20px;\n  gap: 20px;\n  background-color: transparent;\n}\n.instruction-text {\n  pointer-events: all;\n  background: var(--color-dark-gray);\n  color: var(--color-white);\n  padding: 12px 24px;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: var(--font-weight-semibold);\n  border: 1px solid var(--color-light-gray);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  text-align: center;\n}\n.map {\n  flex: 1;\n  width: 100%;\n  border-radius: 20px;\n  overflow: hidden;\n  pointer-events: all;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);\n}\n.confirm-btn {\n  pointer-events: all;\n  min-width: 250px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.confirm-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  filter: grayscale(1);\n}\n.confirm-btn:disabled:hover {\n  filter: grayscale(1);\n  transform: none;\n}\n.search-section {\n  width: 100%;\n  max-width: 400px;\n  position: relative;\n  pointer-events: all;\n  z-index: 2100;\n}\n.search-bar {\n  display: flex;\n  align-items: center;\n  background: var(--color-dark-gray);\n  border: 1px solid var(--color-light-gray);\n  border-radius: 12px;\n  padding: 8px 16px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.search-bar mat-icon {\n  color: var(--color-gray);\n  margin-right: 8px;\n}\n.search-bar input {\n  flex: 1;\n  background: transparent;\n  border: none;\n  color: white;\n  font-size: 16px;\n  outline: none;\n}\n.search-bar input::placeholder {\n  color: var(--color-gray);\n}\n.clear-icon {\n  cursor: pointer;\n  color: var(--color-gray);\n  margin-left: 8px;\n}\n.clear-icon:hover {\n  color: white;\n}\n.search-results {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  width: 100%;\n  background: var(--color-dark-gray);\n  border: 1px solid var(--color-light-gray);\n  border-radius: 12px;\n  margin-top: 8px;\n  max-height: 200px;\n  overflow-y: auto;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n  z-index: 2200;\n}\n.result-item {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 12px 16px;\n  cursor: pointer;\n  transition: background 0.2s;\n  color: white;\n}\n.result-item:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.result-item mat-icon {\n  color: var(--color-gray);\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n/*# sourceMappingURL=map-location-selector.css.map */\n";
  }
});

// src/components/map-location-selector/map-location-selector.ts
var mapboxgl, MapLocationSelector;
var init_map_location_selector3 = __esm({
  "src/components/map-location-selector/map-location-selector.ts"() {
    "use strict";
    init_tslib_es6();
    init_map_location_selector();
    init_map_location_selector2();
    init_core();
    init_common();
    init_forms();
    init_icon();
    init_environment();
    mapboxgl = __toESM(require_mapbox_gl());
    init_mapbox_service();
    MapLocationSelector = class MapLocationSelector2 {
      mapboxService;
      locationSelected = new EventEmitter();
      close = new EventEmitter();
      map;
      selectedMarker = null;
      selectedCoords = null;
      searchQuery = "";
      cityResults = [];
      constructor(mapboxService) {
        this.mapboxService = mapboxService;
      }
      ngAfterViewInit() {
        this.map = new mapboxgl.Map({
          accessToken: Environment.mapboxToken,
          container: "location-map",
          style: "mapbox://styles/fnsbrl/cmhxy97pz004e01qx08c0gc44",
          center: [12.4964, 41.9028],
          zoom: 12,
          pitch: 0,
          bearing: 0
        });
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const coords = [
              position.coords.longitude,
              position.coords.latitude
            ];
            this.map.flyTo({
              center: coords,
              zoom: 17,
              duration: 1e3
            });
          }, (error) => console.warn("Geolocation error:", error));
        }
        this.map.on("click", (e) => {
          this.selectedCoords = [e.lngLat.lng, e.lngLat.lat];
          if (this.selectedMarker) {
            this.selectedMarker.remove();
          }
          const markerEl = document.createElement("div");
          markerEl.style.width = "30px";
          markerEl.style.height = "30px";
          markerEl.style.backgroundColor = "#FCC324";
          markerEl.style.borderRadius = "50%";
          markerEl.style.border = "3px solid white";
          markerEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
          this.selectedMarker = new mapboxgl.Marker({ element: markerEl }).setLngLat(this.selectedCoords).addTo(this.map);
        });
      }
      onSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === "") {
          this.cityResults = [];
          return;
        }
        this.mapboxService.searchCity(this.searchQuery).subscribe((features) => {
          this.cityResults = features.map((f) => ({
            name: f.place_name,
            center: f.center
          }));
        });
      }
      selectCity(city) {
        this.map.flyTo({
          center: city.center,
          zoom: 16,
          essential: true
        });
        this.searchQuery = "";
        this.cityResults = [];
      }
      ngOnDestroy() {
        if (this.map)
          this.map.remove();
      }
      onConfirm() {
        if (this.selectedCoords) {
          this.locationSelected.emit({
            lat: this.selectedCoords[1],
            lng: this.selectedCoords[0]
          });
        }
      }
      onClose() {
        this.close.emit();
      }
      static ctorParameters = () => [
        { type: MapboxService }
      ];
      static propDecorators = {
        locationSelected: [{ type: Output }],
        close: [{ type: Output }]
      };
    };
    MapLocationSelector = __decorate([
      Component({
        selector: "map-location-selector",
        standalone: true,
        imports: [CommonModule, FormsModule, MatIconModule],
        template: map_location_selector_default,
        styles: [map_location_selector_default2]
      })
    ], MapLocationSelector);
  }
});

// angular:jit:template:src/components/user-profile-modal/user-profile-modal.html
var user_profile_modal_default;
var init_user_profile_modal = __esm({
  "angular:jit:template:src/components/user-profile-modal/user-profile-modal.html"() {
    user_profile_modal_default = `<div class="modal-backdrop" (click)="onClose()">
    <div class="modal-container" [class.events-mode]="view === 'events'" (click)="$event.stopPropagation()">
        <div class="modal-header">
            <button class="back-btn header-back-btn mobile-only" (click)="onClose()">
                <mat-icon>arrow_back</mat-icon>
            </button>
            <h2 class="yellow-title">{{ getViewTitle() }}</h2>
            <button class="close-btn tablet-desktop-only" (click)="onClose()">
                <mat-icon>close</mat-icon>
            </button>
        </div>

        @if (loading) {
        <div class="loading-spinner">Loading...</div>
        } @else if (user) {

        <!-- PROFILE VIEW -->
        @if (view === 'profile') {
        <div class="profile-content">
            <div class="avatar-container">
                @if (user.profileImage) {
                <img [src]="user.profileImage" alt="Profile" class="profile-image">
                } @else {
                <div class="profile-placeholder">{{ getInitials(user.name) }}</div>
                }
            </div>

            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-email" *ngIf="user.email && currentUserId && user.id.toString() === currentUserId">
                {{ user.email }}
            </p>
            <p class="user-description" *ngIf="user.description">{{ user.description }}</p>

            <!-- FOLLOW ACTION -->
            @if (currentUserId && user.id.toString() !== currentUserId) {
            <div class="follow-actions">
                <button class="button follow-main-btn" [class.following]="isFollowing" (click)="toggleFollow()">
                    {{ isFollowing ? 'Following' : 'Follow' }}
                </button>
                @if (isFollowing) {
                <button class="bell-btn" [class.active]="notificationsEnabled" [disabled]="notificationsLoading"
                    (click)="toggleNotifications($event)">
                    <mat-icon>{{ notificationsEnabled ? 'notifications' : 'notifications_off' }}</mat-icon>
                </button>
                }
            </div>
            <button class="report-btn" type="button" (click)="openReportModal()">
                <mat-icon>flag</mat-icon>
                Segnala
            </button>
            }

            <div class="stats-container">
                <div class="stat-item clickable" (click)="showFollowers()">
                    <span class="stat-value">{{ user.followersCount || 0 }}</span>
                    <span class="stat-label">Followers</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item clickable" (click)="showFollowing()">
                    <span class="stat-value">{{ user.followingCount || 0 }}</span>
                    <span class="stat-label">Following</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item clickable" (click)="showEvents()">
                    <span class="stat-value">{{ user.approvedEventsCount || 0 }}</span>
                    <span class="stat-label">Events</span>
                </div>
            </div>
        </div>
        }

        <!-- LIST VIEW (Followers/Following) -->
        @if (view === 'followers' || view === 'following') {
        <div class="list-view">
            <div class="list-header">
                <button class="back-btn" (click)="onClose()"> <!-- onClose resets to profile if view != profile -->
                    <mat-icon>arrow_back</mat-icon>
                </button>
                <h3>{{ view === 'followers' ? 'Followers' : 'Following' }}</h3>
            </div>

            <div class="user-list" *ngIf="!loadingList; else loadingTemplate">
                @for (u of userList; track u.id) {
                <div class="user-item">
                    <div class="user-info" (click)="onOpenProfileFromList(u)">
                        @if (u.profileImage) {
                        <img [src]="u.profileImage" class="list-avatar">
                        } @else {
                        <div class="list-avatar-placeholder">{{ getInitials(u.name) }}</div>
                        }
                        <span class="list-username">{{ u.name }}</span>
                    </div>

                    <!-- List Item Follow Logic (Only if logged in and not me) -->
                    @if (currentUserId && u.id.toString() !== currentUserId) {
                    @if (myFollowingIds.has(u.id.toString())) {
                    <button class="unfollow-btn small-btn" (click)="onListUnfollow(u)">Unfollow</button>
                    } @else {
                    <button class="follow-btn small-btn" (click)="onListFollow(u)">Follow</button>
                    }
                    }
                </div>
                }
                @if (userList.length === 0) {
                <div class="empty-list">No users found.</div>
                }
            </div>
            <ng-template #loadingTemplate>
                <div class="loading-spinner">Loading list...</div>
            </ng-template>
        </div>
        }

        <!-- EVENTS VIEW -->
        @if (view === 'events') {
        <div class="events-view">


            <div class="events-section">
                <h4>Upcoming</h4>
                @if (loadingEvents) {
                <div class="loading-spinner">Loading events...</div>
                } @else if (upcomingEvents.length === 0) {
                <div class="empty-list">No upcoming events.</div>
                } @else {
                @for (ev of upcomingEvents; track ev.id) {
                <div class="event-card clickable" (click)="focusEventOnMap(ev)">
                    <div class="event-card-header">
                        <p class="event-title">{{ ev.title }}</p>
                        <p class="event-sub">
                            <mat-icon class="inline-icon">event</mat-icon>
                            <span>{{ formatEventDate(ev) }}</span>
                            <mat-icon class="inline-icon">place</mat-icon>
                            <span>{{ ev.city }}</span>
                        </p>
                    </div>
                    <div class="event-stats">
                        <span class="pill stat-pill">
                            <mat-icon>group</mat-icon>
                            <span>{{ eventStats(ev).participants }} participants</span>
                        </span>
                        <span class="pill stat-pill">
                            <mat-icon>euro</mat-icon>
                            <span>{{ eventStats(ev).cost }}</span>
                        </span>
                    </div>
                </div>
                }
                }
            </div>

            <div class="events-section">
                <h4>Past</h4>
                @if (loadingEvents) {
                <div class="loading-spinner">Loading events...</div>
                } @else if (pastEvents.length === 0) {
                <div class="empty-list">No past events.</div>
                } @else {
                @for (ev of pastEvents; track ev.id) {
                <div class="event-card past">
                    <div class="event-card-header">
                        <p class="event-title">{{ ev.title }}</p>
                        <p class="event-sub">
                            <mat-icon class="inline-icon">event</mat-icon>
                            <span>{{ formatEventDate(ev) }}</span>
                            <mat-icon class="inline-icon">place</mat-icon>
                            <span>{{ ev.city }}</span>
                        </p>
                    </div>
                    <div class="event-stats">
                        <span class="pill stat-pill">
                            <mat-icon>group</mat-icon>
                            <span>{{ eventStats(ev).participants }} participants</span>
                        </span>
                        <span class="pill stat-pill">
                            <mat-icon>euro</mat-icon>
                            <span>{{ eventStats(ev).cost }}</span>
                        </span>
                    </div>
                </div>
                }
                }
            </div>
        </div>
        }

        } @else {
        <div class="error-state">Unable to load profile.</div>
        }
    </div>
</div>

@if (showReportModal && user) {
<app-report-modal [reporterId]="currentUserId" [targetType]="'USER'" [targetId]="user.id.toString()"
    [targetLabel]="user.name" (close)="closeReportModal()" (submitted)="closeReportModal()">
</app-report-modal>
}
`;
  }
});

// angular:jit:style:src/components/user-profile-modal/user-profile-modal.css
var user_profile_modal_default2;
var init_user_profile_modal2 = __esm({
  "angular:jit:style:src/components/user-profile-modal/user-profile-modal.css"() {
    user_profile_modal_default2 = "/* src/components/user-profile-modal/user-profile-modal.css */\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background: var(--modal-backdrop-color);\n  -webkit-backdrop-filter: blur(var(--modal-backdrop-blur));\n  backdrop-filter: blur(var(--modal-backdrop-blur));\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 2000;\n}\n.modal-container {\n  background: var(--modal-surface);\n  width: 90%;\n  max-width: 400px;\n  border-radius: var(--modal-radius);\n  padding: 24px;\n  color: white;\n  border: var(--modal-border);\n  box-shadow: var(--modal-shadow);\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.modal-container.events-mode {\n  background: var(--modal-surface);\n}\n@media (max-width: 768px) {\n  .modal-container {\n    width: 100%;\n    max-width: 100%;\n    height: 100%;\n    max-height: 100vh;\n    border-radius: 0;\n    padding: 24px 32px 80px 32px;\n  }\n  .profile-content {\n    padding: 0 8px;\n  }\n}\n.modal-header {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 24px;\n  padding-top: 2px;\n  position: relative;\n}\n.modal-header h2 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n  line-height: 1.2;\n  text-align: center;\n}\n.yellow-title {\n  color: var(--color-accent) !important;\n}\n@media (max-width: 768px) {\n  .modal-header {\n    justify-content: center;\n    gap: 16px;\n  }\n  .modal-header h2 {\n    text-align: center;\n    flex: 0 1 auto;\n  }\n  .header-back-btn {\n    display: inline-flex !important;\n  }\n}\n.close-btn {\n  background: none;\n  border: none;\n  color: #fff;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.close-btn:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.profile-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 12px;\n}\n.avatar-container {\n  position: relative;\n  width: 100px;\n  height: 100px;\n}\n.profile-image,\n.profile-placeholder {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.profile-placeholder {\n  background:\n    linear-gradient(\n      135deg,\n      #FFB800,\n      #FFDC73);\n  color: #1a1a1a;\n  font-size: 36px;\n  font-weight: bold;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.user-name {\n  margin: 0;\n  font-size: 22px;\n  font-weight: 600;\n}\n.user-email {\n  margin: 0;\n  color: #888;\n  font-size: 14px;\n}\n.user-description {\n  margin: 8px 0 0 0;\n  color: #e0e0e0;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 1.4;\n  max-width: 90%;\n  opacity: 0.9;\n  text-align: center;\n}\n.follow-actions {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  margin: 6px 0 12px;\n}\n.report-btn {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  color: #ff8b8b;\n  padding: 8px 14px;\n  border-radius: 18px;\n  cursor: pointer;\n  font-size: 13px;\n}\n.report-btn mat-icon {\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n}\n.report-btn:hover {\n  border-color: rgba(255, 139, 139, 0.6);\n}\n.stats-container {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0;\n  margin-top: 16px;\n  background: rgba(255, 255, 255, 0.05);\n  padding: 16px 12px;\n  border-radius: 12px;\n  width: 100%;\n}\n.stat-item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 4px;\n  flex: 1;\n}\n.stat-item.clickable {\n  cursor: pointer;\n}\n.stat-item.clickable:hover {\n  opacity: 0.8;\n}\n.stat-value {\n  font-size: 18px;\n  font-weight: 700;\n  color: #FFB800;\n}\n.stat-label {\n  font-size: 11px;\n  color: #888;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.stat-divider {\n  width: 1px;\n  height: 30px;\n  background: rgba(255, 255, 255, 0.1);\n  flex-shrink: 0;\n}\n.follow-main-btn {\n  width: 100%;\n  max-width: 220px;\n  margin: 0 auto;\n  color: #ffffff !important;\n}\n.follow-main-btn:not(.following) {\n  background-color: var(--color-accent);\n}\n.follow-main-btn.following {\n  background: rgba(255, 255, 255, 0.1);\n  color: #ffffff;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}\n.bell-btn {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  background: rgba(255, 255, 255, 0.06);\n  color: #f1f1f1;\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n  transition:\n    background-color 0.2s ease,\n    border-color 0.2s ease,\n    transform 0.1s ease;\n}\n.bell-btn:hover {\n  background: rgba(255, 255, 255, 0.12);\n}\n.bell-btn:active {\n  transform: translateY(1px);\n}\n.bell-btn.active {\n  border-color: var(--color-accent);\n  background: rgba(251, 188, 4, 0.18);\n  color: var(--color-accent);\n}\n.bell-btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.events-view {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  overflow-y: auto;\n  padding-right: 4px;\n  scrollbar-width: thin;\n  scrollbar-color: var(--color-bit-gray) transparent;\n  max-height: 500px;\n}\n.events-section {\n  background: rgba(255, 255, 255, 0.04);\n  padding: 12px;\n  border-radius: 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);\n}\n.events-view::-webkit-scrollbar {\n  width: 6px;\n}\n.events-view::-webkit-scrollbar-track {\n  background: transparent;\n}\n.events-view::-webkit-scrollbar-thumb {\n  background-color: var(--color-bit-gray);\n  border-radius: 20px;\n}\n.events-section h4 {\n  margin: 0;\n  font-size: 14px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  color: #cfcfcf;\n}\n.event-card {\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 14px;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);\n}\n.event-card.clickable {\n  cursor: pointer;\n  transition:\n    border-color 0.2s ease,\n    background-color 0.2s ease,\n    transform 0.1s ease;\n}\n.event-card.clickable:hover {\n  border-color: rgba(252, 195, 36, 0.4);\n  background: rgba(255, 255, 255, 0.08);\n}\n.event-card.clickable:active {\n  transform: translateY(1px);\n}\n.event-card.past {\n  opacity: 0.85;\n}\n.event-card-header {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.event-title {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 800;\n  color: #fdfdfd;\n}\n.event-sub {\n  margin: 2px 0 0 0;\n  font-size: 13px;\n  color: #d6d6d6;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.event-sub .inline-icon {\n  color: var(--color-accent);\n  font-size: 18px;\n  width: 18px;\n  height: 18px;\n  line-height: 18px;\n  flex-shrink: 0;\n}\n.event-stats {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n}\n.stat-pill {\n  border-color: rgba(255, 255, 255, 0.15);\n  background: rgba(255, 255, 255, 0.08);\n  color: #f5f5f5;\n  font-size: 12px;\n  padding: 7px 9px;\n  gap: 5px;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n}\n.stat-pill mat-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  line-height: 16px;\n  color: var(--color-accent);\n  flex-shrink: 0;\n}\n.list-view {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  overflow: hidden;\n}\n.list-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.back-btn {\n  background: none;\n  border: none;\n  color: white;\n  cursor: pointer;\n  padding: 4px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  line-height: 0;\n}\n.header-back-btn {\n  position: absolute;\n  left: 12px;\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 2;\n}\n.modal-header .close-btn {\n  position: absolute;\n  right: 0;\n  top: 50%;\n  transform: translateY(-50%);\n}\n.user-list {\n  flex: 1;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding-right: 4px;\n}\n.user-item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px;\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 8px;\n}\n.user-info {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  cursor: pointer;\n}\n.list-avatar,\n.list-avatar-placeholder {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.list-avatar-placeholder {\n  background: #FFB800;\n  color: #1a1a1a;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  font-size: 14px;\n}\n.list-username {\n  font-weight: 500;\n  font-size: 14px;\n}\n.small-btn {\n  padding: 6px 12px;\n  border-radius: 16px;\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n  border: none;\n}\n.small-btn.follow-btn {\n  background: #FFB800;\n  color: #1a1a1a;\n}\n.small-btn.unfollow-btn {\n  background: rgba(255, 255, 255, 0.1);\n  color: white;\n}\n.loading-spinner,\n.error-state,\n.empty-list {\n  text-align: center;\n  color: #888;\n  padding: 20px;\n}\n/*# sourceMappingURL=user-profile-modal.css.map */\n";
  }
});

// src/components/user-profile-modal/user-profile-modal.component.ts
var UserProfileModalComponent;
var init_user_profile_modal_component = __esm({
  "src/components/user-profile-modal/user-profile-modal.component.ts"() {
    "use strict";
    init_tslib_es6();
    init_user_profile_modal();
    init_user_profile_modal2();
    init_core();
    init_common();
    init_icon();
    init_user_service();
    init_confirmation_service();
    init_event_service();
    init_report_modal_component3();
    UserProfileModalComponent = class UserProfileModalComponent2 {
      userService;
      eventService;
      confirmation;
      userId = null;
      currentUserId = null;
      close = new EventEmitter();
      openProfile = new EventEmitter();
      focusEvent = new EventEmitter();
      user = null;
      isFollowing = false;
      loading = false;
      notificationsEnabled = false;
      notificationsLoading = false;
      view = "profile";
      userList = [];
      loadingList = false;
      myFollowingIds = /* @__PURE__ */ new Set();
      loadingEvents = false;
      upcomingEvents = [];
      pastEvents = [];
      showReportModal = false;
      constructor(userService, eventService, confirmation) {
        this.userService = userService;
        this.eventService = eventService;
        this.confirmation = confirmation;
      }
      ngOnChanges(changes) {
        if (changes["userId"] && this.userId) {
          this.loadUser();
          this.checkIfFollowing();
        }
      }
      onClose() {
        if (this.view !== "profile") {
          this.view = "profile";
        } else {
          this.close.emit();
        }
      }
      getViewTitle() {
        switch (this.view) {
          case "followers":
            return "Followers";
          case "following":
            return "Following";
          case "events":
            return "Events";
          default:
            return "Profile";
        }
      }
      loadUser() {
        if (!this.userId)
          return;
        this.loading = true;
        this.userService.getUserById(this.userId).subscribe({
          next: (u) => {
            this.user = u;
            this.loading = false;
          },
          error: (err) => {
            console.error("Error loading user profile", err);
            this.loading = false;
          }
        });
      }
      checkIfFollowing() {
        if (!this.userId || !this.currentUserId)
          return;
        this.userService.isFollowing(this.currentUserId, this.userId).subscribe({
          next: (res) => {
            this.isFollowing = res.isFollowing;
            if (this.isFollowing) {
              this.loadNotificationPreference();
            } else {
              this.notificationsEnabled = false;
            }
          },
          error: (err) => console.error(err)
        });
      }
      toggleFollow() {
        return __async(this, null, function* () {
          if (!this.userId || !this.currentUserId)
            return;
          if (this.isFollowing) {
            const confirmed = yield this.confirmation.confirm({
              title: "Unfollow user",
              message: "Are you sure you want to unfollow this user?",
              confirmText: "Unfollow",
              cancelText: "Cancel",
              confirmClass: "white-text"
            });
            if (!confirmed)
              return;
            this.userService.unfollowUser(this.currentUserId, this.userId).subscribe({
              next: () => {
                this.isFollowing = false;
                if (this.user) {
                  this.user.followersCount = (this.user.followersCount || 1) - 1;
                }
                this.userService.notifyUserUpdate();
              },
              error: (err) => console.error(err)
            });
          } else {
            this.userService.followUser(this.currentUserId, this.userId).subscribe({
              next: () => {
                this.isFollowing = true;
                this.notificationsEnabled = true;
                if (this.user) {
                  this.user.followersCount = (this.user.followersCount || 0) + 1;
                }
                this.userService.notifyUserUpdate();
              },
              error: (err) => console.error(err)
            });
          }
        });
      }
      getInitials(name) {
        if (!name)
          return "";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      showFollowers() {
        if (!this.userId)
          return;
        this.view = "followers";
        this.loadingList = true;
        this.userService.getFollowers(this.userId).subscribe({
          next: (followers) => {
            this.userList = followers;
            this.fetchMyFollowing();
          },
          error: (err) => {
            console.error(err);
            this.loadingList = false;
          }
        });
      }
      showFollowing() {
        if (!this.userId)
          return;
        this.view = "following";
        this.loadingList = true;
        this.userService.getFollowing(this.userId).subscribe({
          next: (following) => {
            this.userList = following;
            this.fetchMyFollowing();
          },
          error: (err) => {
            console.error(err);
            this.loadingList = false;
          }
        });
      }
      fetchMyFollowing() {
        if (!this.currentUserId) {
          this.loadingList = false;
          return;
        }
        this.userService.getFollowing(this.currentUserId).subscribe({
          next: (following) => {
            this.myFollowingIds = new Set(following.map((u) => u.id.toString()));
            this.loadingList = false;
          },
          error: (err) => {
            console.error(err);
            this.loadingList = false;
          }
        });
      }
      onListFollow(targetUser) {
        if (!this.currentUserId)
          return;
        this.userService.followUser(this.currentUserId, targetUser.id.toString()).subscribe({
          next: () => {
            this.myFollowingIds.add(targetUser.id.toString());
            this.userService.notifyUserUpdate();
          },
          error: (err) => console.error(err)
        });
      }
      onOpenProfileFromList(targetUser) {
        if (!targetUser?.id)
          return;
        this.view = "profile";
        this.openProfile.emit(targetUser.id.toString());
      }
      onListUnfollow(targetUser) {
        return __async(this, null, function* () {
          if (!this.currentUserId)
            return;
          const confirmed = yield this.confirmation.confirm({
            title: "Unfollow user",
            message: `Are you sure you want to unfollow ${targetUser.name}?`,
            confirmText: "Unfollow",
            cancelText: "Cancel",
            confirmClass: "white-text"
          });
          if (!confirmed)
            return;
          this.userService.unfollowUser(this.currentUserId, targetUser.id.toString()).subscribe({
            next: () => {
              this.myFollowingIds.delete(targetUser.id.toString());
              this.userService.notifyUserUpdate();
            },
            error: (err) => console.error(err)
          });
        });
      }
      showEvents() {
        if (!this.userId)
          return;
        this.view = "events";
        if (this.upcomingEvents.length || this.pastEvents.length || this.loadingEvents) {
          return;
        }
        this.loadingEvents = true;
        this.eventService.getOrganizedEvents(this.userId).subscribe({
          next: (events) => {
            const now = /* @__PURE__ */ new Date();
            this.upcomingEvents = [];
            this.pastEvents = [];
            events.forEach((ev) => {
              const eventDate = /* @__PURE__ */ new Date(`${ev.date}T${ev.endTime || ev.startTime || "00:00"}`);
              if (eventDate.getTime() >= now.getTime()) {
                this.upcomingEvents.push(ev);
              } else {
                this.pastEvents.push(ev);
              }
            });
            this.upcomingEvents.sort((a, b) => (/* @__PURE__ */ new Date(`${a.date}T${a.startTime || "00:00"}`)).getTime() - (/* @__PURE__ */ new Date(`${b.date}T${b.startTime || "00:00"}`)).getTime());
            this.pastEvents.sort((a, b) => (/* @__PURE__ */ new Date(`${b.date}T${b.startTime || "00:00"}`)).getTime() - (/* @__PURE__ */ new Date(`${a.date}T${a.startTime || "00:00"}`)).getTime());
            this.loadingEvents = false;
          },
          error: (err) => {
            console.error("Error loading events by user", err);
            this.loadingEvents = false;
          }
        });
      }
      focusEventOnMap(event) {
        this.focusEvent.emit(event);
      }
      formatEventDate(ev) {
        const date = ev.date ? /* @__PURE__ */ new Date(`${ev.date}T00:00:00`) : null;
        const start = ev.startTime ? ev.startTime.slice(0, 5) : "";
        const end = ev.endTime ? ev.endTime.slice(0, 5) : "";
        const datePart = date ? date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }) : "";
        const timePart = start && end ? `${start} - ${end}` : start || end;
        return [datePart, timePart].filter(Boolean).join(" \u2022 ");
      }
      eventStats(ev) {
        const occupied = ev.occupiedSpots ?? 0;
        const max = ev.nPartecipants ?? null;
        let participants = `${occupied}${max ? `/${max}` : ""}`;
        let freeSpots;
        if (max != null) {
          freeSpots = Math.max(max - occupied, 0).toString();
        }
        const cost = ev.costPerPerson == null || ev.costPerPerson === 0 ? "Free" : ev.costPerPerson.toString();
        return { participants, freeSpots, cost };
      }
      toggleNotifications(event) {
        event?.stopPropagation();
        if (!this.currentUserId || !this.userId || !this.isFollowing)
          return;
        const nextValue = !this.notificationsEnabled;
        this.notificationsLoading = true;
        this.userService.setFollowNotifications(this.currentUserId, this.userId, nextValue).subscribe({
          next: (res) => {
            this.notificationsEnabled = res.enabled;
            this.notificationsLoading = false;
          },
          error: (err) => {
            console.error("Error updating follow notifications", err);
            this.notificationsLoading = false;
          }
        });
      }
      openReportModal() {
        if (!this.user || !this.currentUserId)
          return;
        if (this.user.id.toString() === this.currentUserId)
          return;
        this.showReportModal = true;
      }
      closeReportModal() {
        this.showReportModal = false;
      }
      loadNotificationPreference() {
        if (!this.currentUserId || !this.userId)
          return;
        this.notificationsLoading = true;
        this.userService.getFollowNotifications(this.currentUserId, this.userId).subscribe({
          next: (res) => {
            this.notificationsEnabled = !!res.enabled;
            this.notificationsLoading = false;
          },
          error: (err) => {
            console.error("Error loading follow notification preference", err);
            this.notificationsEnabled = false;
            this.notificationsLoading = false;
          }
        });
      }
      static ctorParameters = () => [
        { type: UserService },
        { type: EventService },
        { type: ConfirmationService }
      ];
      static propDecorators = {
        userId: [{ type: Input }],
        currentUserId: [{ type: Input }],
        close: [{ type: Output }],
        openProfile: [{ type: Output }],
        focusEvent: [{ type: Output }]
      };
    };
    UserProfileModalComponent = __decorate([
      Component({
        selector: "app-user-profile-modal",
        standalone: true,
        imports: [CommonModule, MatIconModule, ReportModalComponent],
        template: user_profile_modal_default,
        styles: [user_profile_modal_default2]
      })
    ], UserProfileModalComponent);
  }
});

// src/app/pages/home/home.ts
var Home;
var init_home3 = __esm({
  "src/app/pages/home/home.ts"() {
    "use strict";
    init_tslib_es6();
    init_home();
    init_home2();
    init_core();
    init_router();
    init_http();
    init_auth_service();
    init_map_view();
    init_sign_up_popup();
    init_sign_in_popup();
    init_verify_email_popup();
    init_action_bar3();
    init_crop_image_popup3();
    init_create_event_popup3();
    init_event_popup_card3();
    init_event_chat_modal3();
    init_map_location_selector3();
    init_user_profile_modal_component();
    init_event_service();
    init_user_service();
    init_confirmation_service();
    Home = class Home2 {
      route;
      router;
      authService;
      http;
      eventService;
      userService;
      confirmation;
      mapView;
      showSignUp = false;
      showSignIn = false;
      showVerifyPopup = false;
      showCropPopup = false;
      selectedImageFile = null;
      showCreateEventPopup = false;
      showChatModal = false;
      showLocationSelector = false;
      selectedEvent = null;
      chatEvent = null;
      previousSelectedEvent = null;
      eventScreenPosition = null;
      showUserProfile = false;
      selectedUserProfileId = null;
      loggedUser = null;
      recentEmail = "";
      recentToken = "";
      emailVerified = false;
      pendingSharedEventId = null;
      sharedEventRetryCount = 0;
      sharedEventLoading = false;
      constructor(route, router, authService, http, eventService, userService, confirmation) {
        this.route = route;
        this.router = router;
        this.authService = authService;
        this.http = http;
        this.eventService = eventService;
        this.userService = userService;
        this.confirmation = confirmation;
      }
      ngOnInit() {
        this.refreshLocalUser();
        this.checkAdminRedirect();
        this.userService.userUpdates$.subscribe(() => {
          this.refreshUserFromBackend();
        });
        this.route.queryParams.subscribe((params) => {
          const token = params["token"];
          const email = params["email"];
          const userId = params["user"];
          const eventId = params["event"];
          if (userId) {
            this.openUserProfile(userId);
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { user: null },
              queryParamsHandling: "merge",
              replaceUrl: true
            });
          }
          if (eventId) {
            const parsed = Number(eventId);
            if (!Number.isNaN(parsed)) {
              this.pendingSharedEventId = parsed;
              this.loadSharedEvent();
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { event: null },
              queryParamsHandling: "merge",
              replaceUrl: true
            });
          }
          if (token) {
            this.recentToken = token;
            this.recentEmail = email || "";
            this.openVerifyPopup();
            this.authService.verifyEmail(token).subscribe({
              next: (res) => {
                this.emailVerified = true;
              },
              error: () => this.emailVerified = false
            });
          }
        });
      }
      ngAfterViewInit() {
        this.loadSharedEvent();
      }
      checkAdminRedirect() {
        if (this.loggedUser && this.loggedUser.isAdmin) {
          this.router.navigate(["/admin"]);
        }
      }
      refreshLocalUser() {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            this.loggedUser = JSON.parse(storedUser);
          } catch (e) {
            console.error("Error parsing local user", e);
            localStorage.removeItem("user");
          }
        }
      }
      refreshUserFromBackend() {
        if (!this.loggedUser)
          return;
        this.userService.getUserById(this.loggedUser.id).subscribe({
          next: (user) => {
            this.loggedUser = {
              id: user.id || "",
              name: user.name || user.email || "User",
              email: user.email || "",
              description: user.description,
              profileImage: user.profileImage,
              followersCount: user.followersCount,
              followingCount: user.followingCount,
              isAdmin: user.isAdmin
            };
            if (this.loggedUser?.isAdmin) {
              this.router.navigate(["/admin"]);
              return;
            }
            localStorage.setItem("user", JSON.stringify(this.loggedUser));
            console.log("User refreshed:", this.loggedUser);
          },
          error: (err) => console.error("Error refreshing user", err)
        });
      }
      loadSharedEvent() {
        if (!this.pendingSharedEventId || this.sharedEventLoading)
          return;
        const eventId = this.pendingSharedEventId;
        const currentUserId = this.loggedUser ? this.loggedUser.id : void 0;
        this.sharedEventLoading = true;
        this.eventService.getEventById(eventId, currentUserId).subscribe({
          next: (event) => {
            this.sharedEventLoading = false;
            this.openSharedEventOnMap(event);
          },
          error: (err) => {
            this.sharedEventLoading = false;
            this.pendingSharedEventId = null;
            console.error("Error loading shared event", err);
          }
        });
      }
      openSharedEventOnMap(event) {
        if (!this.mapView?.map) {
          if (this.sharedEventRetryCount < 12) {
            this.sharedEventRetryCount += 1;
            setTimeout(() => this.openSharedEventOnMap(event), 250);
          }
          return;
        }
        this.sharedEventRetryCount = 0;
        this.pendingSharedEventId = null;
        this.mapView.flyToEvent(event);
      }
      openVerifyPopup(email, token) {
        if (email !== void 0)
          this.recentEmail = email;
        if (token !== void 0)
          this.recentToken = token;
        this.closeAll();
        this.showVerifyPopup = true;
      }
      resendEmail() {
        if (!this.recentToken && !this.recentEmail) {
          return;
        }
        this.authService.resendEmail({ oldToken: this.recentToken, email: this.recentEmail }).subscribe({
          next: (res) => {
            if (res?.data?.token) {
              this.recentToken = res.data.token;
            }
            this.emailVerified = false;
          },
          error: (err) => {
            console.error("Error resending verification email", err);
          }
        });
      }
      openSignUp() {
        this.closeAll();
        this.showSignUp = true;
      }
      openSignIn() {
        this.closeAll();
        this.showSignIn = true;
      }
      closeAll() {
        this.showSignUp = false;
        this.showSignIn = false;
        this.showVerifyPopup = false;
        this.showCropPopup = false;
        this.showCreateEventPopup = false;
        this.showChatModal = false;
        this.chatEvent = null;
        this.previousSelectedEvent = null;
        this.showLocationSelector = false;
        this.closeEventPopup();
        if (this.mapView)
          this.mapView.managedPopupType = null;
        this.showUserProfile = false;
        this.selectedUserProfileId = null;
      }
      openUserProfile(userId) {
        console.log("[Home] openUserProfile", userId);
        this.closeAll();
        this.selectedUserProfileId = userId;
        this.showUserProfile = true;
      }
      openEventPopup(event) {
        this.selectedEvent = event;
        this.updateCardPosition();
        if (this.mapView && this.mapView.map) {
          this.mapView.map.off("move", this.updateCardPosition.bind(this));
          this.mapView.map.on("move", this.updateCardPosition.bind(this));
          this.mapView.map.off("click", this.onMapClick.bind(this));
          this.mapView.map.on("click", this.onMapClick.bind(this));
        }
        const currentUserId = this.loggedUser ? this.loggedUser.id : void 0;
        this.eventService.getEventById(event.id, currentUserId).subscribe({
          next: (freshEvent) => {
            this.selectedEvent = freshEvent;
            this.updateCardPosition();
          },
          error: (err) => console.error("Error fetching fresh event data", err)
        });
        setTimeout(() => {
          document.addEventListener("click", this.onDocumentClick);
        }, 0);
      }
      openChat(event) {
        if (!this.loggedUser) {
          this.openSignIn();
          return;
        }
        if (this.selectedEvent) {
          this.previousSelectedEvent = this.selectedEvent;
          this.closeEventPopup();
        }
        this.chatEvent = event;
        this.showChatModal = true;
      }
      onChatNotification(eventId) {
        if (!this.loggedUser) {
          this.openSignIn();
          return;
        }
        this.eventService.getEventById(eventId, this.loggedUser.id).subscribe({
          next: (event) => {
            this.closeAll();
            this.openChat(event);
          },
          error: (err) => console.error("Error opening chat from notification", err)
        });
      }
      onUpcomingEventNotification(eventId) {
        const currentUserId = this.loggedUser ? this.loggedUser.id : void 0;
        this.eventService.getEventById(eventId, currentUserId).subscribe({
          next: (event) => {
            this.closeAll();
            if (this.mapView) {
              this.mapView.flyToEvent(event);
            }
          },
          error: (err) => console.error("Error opening event from notification", err)
        });
      }
      closeChat() {
        this.showChatModal = false;
        this.chatEvent = null;
        if (this.previousSelectedEvent) {
          const eventToRestore = this.previousSelectedEvent;
          this.previousSelectedEvent = null;
          this.openEventPopup(eventToRestore);
        }
      }
      onEventsUpdated(newEvents) {
        if (this.selectedEvent) {
          const updatedEvent = newEvents.find((e) => e.id === this.selectedEvent.id);
          if (updatedEvent) {
            this.selectedEvent = updatedEvent;
          }
        }
      }
      updateCardPosition() {
        if (this.selectedEvent && this.mapView) {
          this.eventScreenPosition = this.mapView.getEventScreenPosition(this.selectedEvent);
        }
      }
      onMapClick(e) {
        if (e.defaultPrevented)
          return;
        this.closeEventPopup();
      }
      onDocumentClick = (event) => {
        this.closeEventPopup();
      };
      closeEventPopup() {
        this.selectedEvent = null;
        this.eventScreenPosition = null;
        if (this.mapView && this.mapView.map) {
          this.mapView.map.off("move", this.updateCardPosition.bind(this));
          this.mapView.map.off("click", this.onMapClick.bind(this));
        }
        document.removeEventListener("click", this.onDocumentClick);
      }
      onParticipate(event) {
        console.log("onParticipate called for event:", event.id);
        if (!this.loggedUser) {
          console.log("User not logged in, opening sign in");
          this.openSignIn();
          return;
        }
        console.log("Sending request for user:", this.loggedUser.id, "event:", event.id);
        this.eventService.requestParticipation(event.id, this.loggedUser.id).subscribe({
          next: () => {
            console.log("Request success");
            if (this.selectedEvent && this.selectedEvent.id === event.id) {
              console.log("Updating local state to PENDING");
              this.selectedEvent.participationStatus = "PENDING";
            }
          },
          error: (err) => console.error("Error requesting participation", err)
        });
      }
      onLeaveEvent(event) {
        return __async(this, null, function* () {
          if (!this.loggedUser) {
            this.openSignIn();
            return;
          }
          const confirmed = yield this.confirmation.confirm({
            title: "Leave event",
            message: "Are you sure you want to leave the event?",
            confirmText: "Leave",
            cancelText: "Cancel"
          });
          if (!confirmed)
            return;
          this.eventService.leaveEvent(event.id, this.loggedUser.id).subscribe({
            next: () => {
              if (this.selectedEvent && this.selectedEvent.id === event.id) {
                this.selectedEvent.participationStatus = "NONE";
                this.selectedEvent.isParticipating = false;
                if (typeof this.selectedEvent.occupiedSpots === "number" && this.selectedEvent.occupiedSpots > 0) {
                  this.selectedEvent.occupiedSpots -= 1;
                }
              }
              if (this.mapView) {
                const target = this.mapView.events.find((e) => e.id === event.id);
                if (target) {
                  target.participationStatus = "NONE";
                  target.isParticipating = false;
                  if (typeof target.occupiedSpots === "number" && target.occupiedSpots > 0) {
                    target.occupiedSpots -= 1;
                  }
                }
              }
            },
            error: (err) => console.error("Error leaving event", err)
          });
        });
      }
      onDeleteEvent(event) {
        return __async(this, null, function* () {
          if (!this.loggedUser) {
            this.openSignIn();
            return;
          }
          if (event.creatorId && event.creatorId.toString() !== this.loggedUser.id.toString()) {
            console.warn("You are not the eventer of this event");
            return;
          }
          const confirmed = yield this.confirmation.confirm({
            title: "Delete event",
            message: "Are you sure you want to delete this event? This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            tone: "danger"
          });
          if (!confirmed)
            return;
          this.eventService.deleteEvent(event.id).subscribe({
            next: () => {
              if (this.mapView) {
                this.mapView.events = this.mapView.events.filter((e) => e.id !== event.id);
                this.mapView.loadEvents?.();
              }
              this.closeEventPopup();
            },
            error: (err) => console.error("Error deleting event", err)
          });
        });
      }
      onToggleFavorite() {
        if (this.selectedEvent && this.mapView) {
          this.mapView.onToggleFavorite(this.selectedEvent);
        }
      }
      openShare(event) {
        if (!this.mapView)
          return;
        this.mapView.openShare(event);
      }
      createEventPopupRef = null;
      openLocationSelector() {
        this.showLocationSelector = true;
      }
      onLocationSelected(location) {
        if (this.createEventPopupRef) {
          this.createEventPopupRef.setLocation(location.lat, location.lng);
        }
        this.showLocationSelector = false;
      }
      switchToSignUp() {
        this.openSignUp();
      }
      switchToSignIn() {
        this.openSignIn();
      }
      onSignInSuccess(user) {
        console.log("User received on sign in:", user);
        this.loggedUser = {
          id: user?.id || "",
          name: user?.name || user?.email || "User",
          email: user?.email || "",
          profileImage: user.profileImage,
          isAdmin: user.isAdmin
        };
        if (this.loggedUser.isAdmin) {
          this.router.navigate(["/admin"]);
          return;
        }
        this.refreshUserFromBackend();
        this.closeAll();
      }
      logout() {
        this.loggedUser = null;
        localStorage.removeItem("user");
        this.closeAll();
      }
      onMenuAction(action) {
        console.log("Menu action:", action);
        if (action === "logout") {
          this.logout();
        } else if (action === "change-photo") {
          const fileInput = document.getElementById("hiddenFileInput");
          if (fileInput) {
            fileInput.click();
          }
        } else if (action === "account") {
          console.log("Navigate to Account");
        } else if (action === "events") {
          console.log("Navigate to Events");
        } else if (action === "add-event") {
          console.log("Create Event clicked");
          this.showCreateEventPopup = true;
        }
      }
      onFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
          this.selectedImageFile = file;
          this.showCropPopup = true;
          event.target.value = "";
        }
      }
      onImageCropped(blob) {
        if (this.loggedUser) {
          const formData = new FormData();
          formData.append("file", blob, "profile.jpg");
          this.http.post(`http://localhost:8080/api/users/${this.loggedUser.id}/image`, formData).subscribe({
            next: (res) => {
              if (this.loggedUser) {
                this.loggedUser.profileImage = res.imageUrl + "?t=" + (/* @__PURE__ */ new Date()).getTime();
                localStorage.setItem("user", JSON.stringify(this.loggedUser));
                this.closeAll();
              }
            },
            error: (err) => console.error("Error uploading image", err)
          });
        }
      }
      onFocusEventFromMenu(event) {
        if (this.mapView) {
          this.mapView.flyToEvent(event);
        }
      }
      onFocusEventFromProfile(event) {
        this.closeAll();
        if (this.mapView) {
          this.mapView.flyToEvent(event);
        }
      }
      static ctorParameters = () => [
        { type: ActivatedRoute },
        { type: Router },
        { type: AuthService },
        { type: HttpClient },
        { type: EventService },
        { type: UserService },
        { type: ConfirmationService }
      ];
      static propDecorators = {
        mapView: [{ type: ViewChild, args: [MapView] }]
      };
    };
    Home = __decorate([
      Component({
        selector: "Home",
        standalone: true,
        imports: [MapView, SignUpPopup, SignInPopup, VerifyEmailPopup, ActionBarComponent, CropImagePopup, CreateEventPopup, EventPopupCard, MapLocationSelector, UserProfileModalComponent, EventChatModalComponent],
        template: home_default,
        styles: [home_default2]
      })
    ], Home);
  }
});

// src/app/pages/home/home.spec.ts
var require_home_spec = __commonJS({
  "src/app/pages/home/home.spec.ts"(exports) {
    init_testing();
    init_home3();
    describe("Home", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Home]
        }).compileComponents();
        fixture = TestBed.createComponent(Home);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_home_spec();
//# sourceMappingURL=spec-app-pages-home-home.spec.js.map
