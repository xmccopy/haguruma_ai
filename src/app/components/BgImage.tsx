'use client'

import Image from "next/image";

interface BgImageProps {
    imageUrl: string
}

const BgImage: React.FC<BgImageProps> = ({
    imageUrl
}) => {
    {
        console.log('bg component', imageUrl);

        let url = `http://62.3.6.59:8000/downloads/${imageUrl}`;

        return (
            <div className="w-full h-[550px] relative">
                {/* <Image
                key={imageUrl}
                    src={`downloads/${imageUrl}`}
                    alt="image"
                    unoptimized
                    fill 
                    style={{ objectFit: 'cover' }}
                    className="z-10"
                /> */}
                {/* <img src={`data:image/jpeg;base64,${imageUrl}`} alt="" style={{objectFit: 'cover', width:'100%', height: '100%'}} /> */}
                <img src={url} alt="" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
        )
    }
}

export default BgImage;