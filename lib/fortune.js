let names = [
    'Israel',
    'Tolulope',
    'Akintunde'
];
exports.getName = () => {
    return names[Math.floor(Math.random() * names.length)];
}