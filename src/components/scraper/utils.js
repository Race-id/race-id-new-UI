export function formatDate(dateStr) {
  try {
    // Definisikan months di awal function
    const months = {
      'Januari': '01', 'Februari': '02', 'Maret': '03',
      'April': '04', 'Mei': '05', 'Juni': '06',
      'Juli': '07', 'Agustus': '08', 'September': '09',
      'Oktober': '10', 'November': '11', 'Desember': '12'
    };

    // Validasi input
    if (!dateStr) {
      console.error('Empty date string');
      return null;
    }

    // Debug log
    console.log('Processing date:', dateStr);

    // Handle date ranges
    if (dateStr.includes(' - ')) {
      dateStr = dateStr.split(' - ')[1].trim();
    }

    // Split date string
    const parts = dateStr.trim().split(' ');
    
    // Validate parts
    if (parts.length !== 3) {
      console.error(`Invalid date format: ${dateStr}`);
      return null;
    }

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    // Get month number
    const monthNum = months[month];
    if (!monthNum) {
      console.error(`Invalid month "${month}" in date: ${dateStr}`);
      return null;
    }

    // Pad day with leading zero
    const paddedDay = day.padStart(2, '0');
    
    return `${year}-${monthNum}-${paddedDay}`;
  } catch (error) {
    console.error(`Error parsing date: ${dateStr}`, error);
    return null;
  }
}

export function validateEvent(event) {
  return (
    event.title && 
    event.url && 
    event.url.includes('kalenderlari.com/events/')
  );
}