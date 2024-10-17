let step = 0;

if (order.status == 1) step = 1
else if (order.status == 2) step = 2
else if (order.status == 4) step = 3;

setStep(step);