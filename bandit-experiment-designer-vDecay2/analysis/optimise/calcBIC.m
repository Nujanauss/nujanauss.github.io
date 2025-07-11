function BIC = calcBIC(LL,k,T)
    BIC = k * log(T) - 2 * LL;
end