import React from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import AlsoViewedItemsList from './AlsoViewedItemsList.jsx';


const CardContainerDiv = styled.div`
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: border-box;
  float: left;
  width: 100%;
  position: relative;
`;

const CardDiv = styled.div`
  position: relative;
  background-color: white;
  line-height: 1;
  border: 1px solid #ccc;
`;

const HeaderDiv = styled.div`
  color: #333;
  padding: 24px 16px 0 16px;
  min-height: 17px;
`;

const H2 = styled.h2`
  font-size: 17px;
  font-weight: 400;
  line-height: 1;
  border: 0;
  margin: 0;
  float: left;
`;

const PaginationSpan = styled.span`
  color: #767676;
  font-size: 17px;
  margin: 0 0 0 7px;
  display: inline;
`;

const FeedbackLink = styled.a`
  color: #333;
  font-size: 11px;
  font-weight: 400;
  margin: 4px 0 0 0;
  float: right;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  };
`;

const ListContainerDiv = styled.div`
  position: relative;
  overflow: hidden;
`;

const ListButton = styled.button`
  display: inline-block;
  background-color: #fff;
  cursor: pointer;
  height: 70px;
  width: 70px;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 35px;
  position: absolute;
  z-index: 1;
  top: 24%;
  opacity: .9;
  transition: background-color .1s ease-out,border .5s ease-out;
`;

const ListButtonLeft = styled(ListButton)`
  padding-left: 35px;
  left: -35px;
  filter: drop-shadow(1px 0 1px rgba(0,0,0,0.15));
`;

const ListButtonRight = styled(ListButton)`
  padding-right: 35px;
  right: -35px;
  filter: drop-shadow(-1px 0 1px rgba(0,0,0,0.15));
`;

function getCategoryId() {
  const idString = window.location.href.split('?')[1] || '';
  const idArray = idString.split('=');
  if (idArray[0] === 'id') {
    return idArray[1];
  }
  return 1; // default id if no id is provided
}

function calculatePages(totalItems) {
  if (totalItems < 6) {
    return 1;
  }
  return Math.ceil(totalItems / 6);
}

class AlsoViewedItemsCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryId: getCategoryId(),
      alsoViewedItems: [],
      startIndex: 0,
      endIndex: 5,
      currentPage: 1,
      totalPages: 0,
      click: true,
    };
    this.cardClickRight = this.cardClickRight.bind(this);
    this.cardClickLeft = this.cardClickLeft.bind(this);
  }

  componentDidMount() {
    const { categoryId } = this.state;

    $.ajax({
      url: `http://localhost:3004/api/alsovieweditems/categoryid/${categoryId}`,
      method: 'GET',
      success: (data) => {
        this.setState({
          alsoViewedItems: data, totalPages: calculatePages(data.length),
        });
      },
      error: (err) => { console.log(err); },
    });
  }

  cardClickRight() {
    const { startIndex, endIndex, currentPage } = this.state;
    this.setState(
      {
        startIndex: startIndex + 6,
        endIndex: endIndex + 6,
        currentPage: currentPage + 1,
        click: false,
      },
    );
  }

  cardClickLeft() {
    const { startIndex, endIndex, currentPage } = this.state;
    this.setState(
      {
        startIndex: startIndex - 6,
        endIndex: endIndex - 6,
        currentPage: currentPage - 1,
        click: true,
      },
    );
  }

  render() {
    const {
      categoryId, alsoViewedItems, startIndex, endIndex, currentPage, totalPages, click,
    } = this.state;
    return (
      <CardContainerDiv>

        <CardDiv>

          <HeaderDiv>
            <H2>People who viewed this item also viewed</H2>
            {
              alsoViewedItems.length
                ? <PaginationSpan>{currentPage}/{totalPages}</PaginationSpan>
                : <PaginationSpan>No Items for category id :  {categoryId}</PaginationSpan>
            }
            <FeedbackLink href="https://www.ebay.com">Feedback on our suggestions</FeedbackLink>
          </HeaderDiv>

          <ListContainerDiv>

            <ListButtonLeft disabled={currentPage === 1} onClick={this.cardClickLeft}><i className="fa fa-chevron-left"></i></ListButtonLeft>

            <AlsoViewedItemsList
              alsoViewedItems={alsoViewedItems}
              startIndex={startIndex}
              endIndex={endIndex}
              click={click}
            />

            <ListButtonRight disabled={currentPage === totalPages} onClick={this.cardClickRight}><i className="fa fa-chevron-right"></i></ListButtonRight>

          </ListContainerDiv>

        </CardDiv>

      </CardContainerDiv>
    );
  }
}

export default AlsoViewedItemsCard;
