function settings = getSettings()
    filename = 'settings.json';
    allFiles = dir(filename);
    if isempty(allFiles)
        error('Settings file not found. Looking for "settings.json" in the current dir.');
    end

    fid = fopen(filename, 'r');
    raw = fread(fid, inf, '*char')';
    fclose(fid);

    settings = jsondecode(raw);
    settings = settings.vars;
end