// database related modules
module.exports = {
    DatabaseConnection: require('./connection'),
    UserRepository: require('./repository/user-repository'),
    SecurityStatusRepository: require('./repository/SecurityStatus-repository'),
    PrivacyRepository: require('./repository/privacy-repository'),
    NotificationSettingsRepository: require('./repository/notificationSettings-repository'),
    DeletedUsersRepository: require('./repository/deletedUsers-repository'),
}