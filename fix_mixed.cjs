const fs = require('fs');

function decodeStr(str) {
    try {
        return Buffer.from(str, 'latin1').toString('utf8');
    } catch (e) {
        return str;
    }
}

function isVietnamese(str) {
    const vnChars = /[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]/;
    return vnChars.test(str);
}

function fixMixedMojibake(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We look for sequences of non-ASCII characters, optionally separated by spaces
    // Because sometimes "TÃ²a nhÃ " has a space.
    // Actually, Latin1 mojibake of UTF-8 typically produces clusters of non-ascii chars.
    
    // Let's replace any contiguous non-ASCII word or sequence.
    // A sequence of non-whitespace chars containing at least one non-ascii:
    const regex = /[^\x00-\x7F]+/g;
    
    content = content.replace(regex, (match) => {
        let dec1 = decodeStr(match);
        if (isVietnamese(dec1)) return dec1;
        
        let dec2 = decodeStr(dec1);
        if (isVietnamese(dec2)) return dec2;
        
        return match; // If it doesn't decode to VN, leave it alone
    });

    // We do a second pass for words because sometimes regex splits at spaces and we want to decode the whole phrase if needed?
    // Actually, Buffer.from on individual words works perfectly because utf-8 bytes map 1-to-1 or 1-to-2 in latin1, spaces are ASCII (0x20) and decode strictly to themselves!
    
    // Wait, let's just regex over sequences containing non-ascii and maybe spaces.
    const regexPhrase = /([^\x00-\x7F]+(?:\s+[^\x00-\x7F]+)*)/g;
    content = fs.readFileSync(filePath, 'utf8'); // Reset
    
    content = content.replace(regexPhrase, (match) => {
        let current = match;
        // Try double decode first
        let d2 = decodeStr(decodeStr(current));
        if (isVietnamese(d2) && d2.length < current.length) return d2;
        
        // Try single decode
        let d1 = decodeStr(current);
        if (isVietnamese(d1) && d1.length < current.length) return d1;
        
        return current;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
}

['e:/rental/pages/BuildingDetail.tsx', 'e:/rental/pages/Equipment.tsx'].forEach(file => {
    try {
        fixMixedMojibake(file);
    } catch (e) {
        console.error('Failed on', file, e);
    }
});
