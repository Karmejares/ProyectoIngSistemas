const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');

function readUsers() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

exports.updateTimeLimit = (req, res) => {
  const { userId, timeLimit } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.timeLimit = timeLimit;
  writeUsers(users);
  res.json({ message: 'Time limit updated' });
};

exports.updatePrivacy = (req, res) => {
  const { userId, privacy } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.privacy = privacy;
  writeUsers(users);
  res.json({ message: 'Privacy settings updated' });
};

exports.changePassword = (req, res) => {
  const { userId, newPassword } = req.body;
  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = newPassword;
  writeUsers(users);
  res.json({ message: 'Password updated successfully' });
};

exports.deleteAccount = (req, res) => {
  const { userId } = req.body;
  let users = readUsers();
  users = users.filter(u => u.id !== userId);
  writeUsers(users);
  res.json({ message: 'Account deleted' });
};
