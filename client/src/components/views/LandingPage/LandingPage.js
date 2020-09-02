import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState("")


    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body);
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
        .then(response => {
            if(response.data.success){
                if(body.loadMore){
                    setProducts([...Products, ...response.data.productInfo]);
                } else {
                    setProducts(response.data.productInfo);
                }
                setPostSize(response.data.postSize)
            } else {
                alert(" 상품들을 가져오는데 실패했습니다.");
            }
        }) 
    }

    const loadMoreHandler = () => {

        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
            // 더보기버튼을 누를 때 가는 추가정보 설정
        }

        getProducts(body);
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}> 
        {/*반응형 작업 전체 길이가 24 */}
        
            <Card
                cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}
            >
                <Meta 
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for(let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }

        return array;
    }

    const handleFilters = (filters, category) => {
        
        const newFilters = { ...Filters }

        newFilters[category] = filters
        //continents 아니면 price를 가리킴

        if(category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues  //ex. [0, 199]
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm

        }
        setSkip(0);
        setSearchTerm(newSearchTerm);
        getProducts(body);
    }

    return (
        <div>
            <div style={{ width: '75%', margin: '3rem auto'}}>

                <div style={{ textalign: 'center'}} >
                    <h2>Let's Travel Anywhere<Icon type="rocket" /></h2>
                </div>

                {/* Filter */}

                <Row gutter={[16, 16]}>
                    <Col lg={12} xs={24}>
                        {/* CheckBox */}
                        <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
                        {/* check된것들의 id가 filter인자로 들어감 */}
                    </Col>
                    <Col lg={12} xs={24}>
                        {/* RadioBox */}
                        <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                    </Col>

                </Row>

                {/* Search */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                    <SearchFeature 
                        refreshFunction={updateSearchTerm}
                    />
                </div>
                {/* Cards */}

                <Row gutter={[16, 16]}>
                    {renderCards}
                </Row>


                <br />

                {PostSize >= Limit &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button onClick={loadMoreHandler}>더보기</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default LandingPage
