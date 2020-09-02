import React, { useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images = []

            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])
    // 두번째 인자 [props.detail] 는 비워지게 되면 [] 최초 랜더링 될떄만 실행되는데 그떄엔
    // props.detail.images가 없어 이미지가 뜨지 않음. 위처럼 인자로 [props.detail]을 넣어
    // 주면 props.detail값이 바뀔때마다 라이프 사이클을 한번더 실행해줘서 이미지가 표시됨

    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
