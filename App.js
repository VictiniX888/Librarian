import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Keyboard, Image, Linking, TouchableOpacity } from 'react-native';
import Book from './Book';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      books: [],
      searchTerm: "",
    };
  }

  _keyExtractor = (item, index) => {
    return item.id;
  }

  getBooks = (query) => {
    return fetch("https://www.googleapis.com/books/v1/volumes?q=" + query).then((res) => {
      return res.json().then((booksJson) => {
        return booksJson.items.map((item) => {
          return new Book(
            item.volumeInfo.title, 
            item.volumeInfo.description, 
            item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : undefined, 
            item.volumeInfo.infoLink);
        });
      })
    });
  }

  searchBooks = () => {
    this.getBooks(this.state.searchTerm).then((data) => {
      this.setState({
        books: data,
      })
    });
    
    Keyboard.dismiss;
  }

  renderBook = ({item}) => {
    const title = item.title;

    let description;
    if (item.description !== undefined) {
      if (item.description.length >= 150) {
        description = item.description.slice(0, 150) + "...";
      } else {
        description = item.description;
      }
    }

    let thumbnail;
    if (item.thumbnail !== undefined) {
      thumbnail = item.thumbnail; 
    } else {
      thumbnail = "https://www.freeiconspng.com/uploads/no-image-icon-6.png";
    }

    const bookLink = item.link;

    return (
      <View style={styles.bookItem}>
        <Image style={styles.bookThumbnail} source={{uri: thumbnail, width: 100, height: 150}} />

        <View style={styles.bookText}>
          <TouchableOpacity onPress={() => Linking.openURL(bookLink)}>
            <Text style={styles.bookTitle}>{title}</Text>
          </TouchableOpacity>
          {description ? (<Text style={styles.bookDescription}>{description}</Text>) : null}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput 
            placeholder="Search for a book..." 
            style={styles.searchTextInput}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({
              searchTerm: text,
            })}
            value={this.state.searchTerm}
            onSubmitEditing={this.searchBooks}
          />
          <Button title="Search" style={styles.searchButton} onPress={this.searchBooks} />
        </View>

        <FlatList style={styles.bookList} data={this.state.books} keyExtractor={this._keyExtractor} renderItem={this.renderBook} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },

  searchView: {
    paddingVertical: 30,
    alignSelf: 'center',
  },

  searchTextInput: {
    padding: 20,
    marginBottom: 5,
    maxWidth: "80%",
    minWidth: "80%",
  },

  searchButton: {
  },

  bookList: {
    paddingLeft: "5%",
    paddingRight: "5%",
  },

  bookItem: {
    display: 'flex',
    flexDirection: 'row',

    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },

  bookThumbnail: {
    marginRight: 5,
  },

  bookText: {
    flexShrink: 1,

    marginLeft: 5,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: "5%",
  }
});
