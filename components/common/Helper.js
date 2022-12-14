export const priceBodyTemplate = (value, digits = 2) => {
    if (isNaN(Number(value))) {
      return
    }
    if(value%1 === 0){
      digits=0
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: digits
    }).format(value)
  }