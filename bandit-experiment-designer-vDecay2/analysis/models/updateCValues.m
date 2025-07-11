function cValues = updateCValues(params)
    previousSelection = params.previousSelection(end);
    alphaC = params.alphaC;

    actionVals = zeros(4, 1);
    actionVals(previousSelection) = 1;
    cValues = params.cValues + alphaC * (actionVals - params.cValues); 
end