export interface PublishedFileDetails {
	result: EResult;
	publishedfileid: string;
	creator?: string;
	preview_url?: string;
	title?: string;
	description?: string;
	time_created?: number;
	time_updated?: number;
	tags?: { tag: string }[];
	file_size?: number;
}

export enum EResult {
	OK = 1, // Success
	Fail = 2, // Generic failure
	NoConnection = 3, // Your Steam client doesn't have a connection to the back-end
	InvalidPassword = 5, // Password/ticket is invalid
	LoggedInElsewhere = 6, // The user is logged in elsewhere
	InvalidProtocolVer = 7, // Protocol version is incorrect
	InvalidParam = 8, // A parameter is incorrect
	FileNotFound = 9, // File was not found
	Busy = 10, // Called method is busy - action not taken
	InvalidState = 11, // Called object was in an invalid state
	InvalidName = 12, // The name was invalid
	InvalidEmail = 13, // The email was invalid
	DuplicateName = 14, // The name is not unique
	AccessDenied = 15, // Access is denied
	Timeout = 16, // Operation timed out
	Banned = 17, // The user is VAC2 banned
	AccountNotFound = 18, // Account not found
	InvalidSteamID = 19, // The Steam ID was invalid
	ServiceUnavailable = 20, // The requested service is currently unavailable
	NotLoggedOn = 21, // The user is not logged on
	Pending = 22, // Request is pending, it may be in process or waiting on third party
	EncryptionFailure = 23, // Encryption or Decryption failed
	InsufficientPrivilege = 24, // Insufficient privilege
	LimitExceeded = 25, // Too much of a good thing
	Revoked = 26, // Access has been revoked (used for revoked guest passes)
	Expired = 27, // License/Guest pass the user is trying to access is expired
	AlreadyRedeemed = 28, // Guest pass has already been redeemed by account, cannot be used again
	DuplicateRequest = 29, // The request is a duplicate and the action has already occurred in the past, ignored this time
	AlreadyOwned = 30, // All the games in this guest pass redemption request are already owned by the user
	IPNotFound = 31, // IP address not found
	PersistFailed = 32, // Failed to write change to the data store
	LockingFailed = 33, // Failed to acquire access lock for this operation
	LogonSessionReplaced = 34, // The logon session has been replaced
	ConnectFailed = 35, // Failed to connect
	HandshakeFailed = 36, // The authentication handshake has failed
	IOFailure = 37, // There has been a generic IO failure
	RemoteDisconnect = 38, // The remote server has disconnected
	ShoppingCartNotFound = 39, // Failed to find the shopping cart requested
	Blocked = 40, // A user blocked the action
	Ignored = 41, // The target is ignoring sender
	NoMatch = 42, // Nothing matching the request found
	AccountDisabled = 43, // The account is disabled
	ServiceReadOnly = 44, // This service is not accepting content changes right now
	AccountNotFeatured = 45, // Account doesn't have value, so this feature isn't available
	AdministratorOK = 46, // Allowed to take this action, but only because requester is admin
	ContentVersion = 47, // A Version mismatch in content transmitted within the Steam protocol
	TryAnotherCM = 48, // The current CM can't service the user making a request, user should try another
	PasswordRequiredToKickSession = 49, // You are already logged in elsewhere, this cached credential login has failed
	AlreadyLoggedInElsewhere = 50, // The user is logged in elsewhere (Use k_EResultLoggedInElsewhere instead!)
	Suspended = 51, // Long running operation has suspended/paused. (eg. content download)
	Cancelled = 52, // Operation has been canceled, typically by user. (eg. a content download)
	DataCorruption = 53, // Operation canceled because data is ill formed or unrecoverable
	DiskFull = 54, // Operation canceled - not enough disk space
	RemoteCallFailed = 55, // The remote or IPC call has failed
	PasswordUnset = 56, // Password could not be verified as it's unset server side
	ExternalAccountUnlinked = 57, // External account (PSN, Facebook...) is not linked to a Steam account
	PSNTicketInvalid = 58, // PSN ticket was invalid
	ExternalAccountAlreadyLinked = 59, // External account (PSN, Facebook...) is already linked to some other account, must explicitly request to replace/delete the link first
	RemoteFileConflict = 60, // The sync cannot resume due to a conflict between the local and remote files
	IllegalPassword = 61, // The requested new password is not allowed
	SameAsPreviousValue = 62, // New value is the same as the old one. This is used for secret question and answer
	AccountLogonDenied = 63, // Account login denied due to 2nd factor authentication failure
	CannotUseOldPassword = 64, // The requested new password is not legal
	InvalidLoginAuthCode = 65, // Account login denied due to auth code invalid
	AccountLogonDeniedNoMail = 66, // Account login denied due to 2nd factor auth failure - and no mail has been sent
	HardwareNotCapableOfIPT = 67, // The users hardware does not support Intel's Identity Protection Technology (IPT)
	IPTInitError = 68, // Intel's Identity Protection Technology (IPT) has failed to initialize
	ParentalControlRestricted = 69, // Operation failed due to parental control restrictions for current user
	FacebookQueryError = 70, // Facebook query returned an error
	ExpiredLoginAuthCode = 71, // Account login denied due to an expired auth code
	IPLoginRestrictionFailed = 72, // The login failed due to an IP restriction
	AccountLockedDown = 73, // The current users account is currently locked for use. This is likely due to a hijacking and pending ownership verification
	AccountLogonDeniedVerifiedEmailRequired = 74, // The logon failed because the accounts email is not verified
	NoMatchingURL = 75, // There is no URL matching the provided values
	BadResponse = 76, // Bad Response due to a Parse failure, missing field, etc
	RequirePasswordReEntry = 77, // The user cannot complete the action until they re-enter their password
	ValueOutOfRange = 78, // The value entered is outside the acceptable range
	UnexpectedError = 79, // Something happened that we didn't expect to ever happen
	Disabled = 80, // The requested service has been configured to be unavailable
	InvalidCEGSubmission = 81, // The files submitted to the CEG server are not valid
	RestrictedDevice = 82, // The device being used is not allowed to perform this action
	RegionLocked = 83, // The action could not be complete because it is region restricted
	RateLimitExceeded = 84, // Temporary rate limit exceeded, try again later, different from k_EResultLimitExceeded which may be permanent
	AccountLoginDeniedNeedTwoFactor = 85, // Need two-factor code to login
	ItemDeleted = 86, // The thing we're trying to access has been deleted
	AccountLoginDeniedThrottle = 87, // Login attempt failed, try to throttle response to possible attacker
	TwoFactorCodeMismatch = 88, // Two factor authentication (Steam Guard) code is incorrect
	TwoFactorActivationCodeMismatch = 89, // The activation code for two-factor authentication (Steam Guard) didn't match
	AccountAssociatedToMultiplePartners = 90, // The current account has been associated with multiple partners
	NotModified = 91, // The data has not been modified
	NoMobileDevice = 92, // The account does not have a mobile device associated with it
	TimeNotSynced = 93, // The time presented is out of range or tolerance
	SmsCodeFailed = 94, // SMS code failure - no match, none pending, etc
	AccountLimitExceeded = 95, // Too many accounts access this resource
	AccountActivityLimitExceeded = 96, // Too many changes to this account
	PhoneActivityLimitExceeded = 97, // Too many changes to this phone
	RefundToWallet = 98, // Cannot refund to payment method, must use wallet
	EmailSendFailure = 99, // Cannot send an email
	NotSettled = 100, // Can't perform operation until payment has settled
	NeedCaptcha = 101, // The user needs to provide a valid captcha
	GSLTDenied = 102, // A game server login token owned by this token's owner has been banned
	GSOwnerDenied = 103, // Game server owner is denied for some other reason such as account locked, community ban, vac ban, missing phone, etc
	InvalidItemType = 104, // The type of thing we were requested to act on is invalid
	IPBanned = 105, // The IP address has been banned from taking this action
	GSLTExpired = 106, // This Game Server Login Token (GSLT) has expired from disuse; it can be reset for use
	InsufficientFunds = 107, // user doesn't have enough wallet funds to complete the action
	TooManyPending = 108 // There are too many of this thing pending already
}
