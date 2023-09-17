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
        {
            label: 'Select All',
            accelerator: 'CommandOrControl+A',
            role: 'selectall',
        },
    ]
};

module.exports = { menu_template }