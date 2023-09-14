const menu_template = {
    label: 'Edit',
    submenu: [
        {
            label: 'Copy',
            accelerator: 'CommandOrControl+C',
            role: 'copy',
        },
        {
            label: 'Paste',
            accelerator: 'CommandOrControl+V',
            role: 'paste',
        },
    ]
};

module.exports = { menu_template }