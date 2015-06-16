/**
 * Tests sit right alongside the file they are testing
 */

//Require the Constructor of the object being tested
var HexDefinition = require("./index.js");

describe( 'HexDefinition:Un-scaled', function() {
  describe( 'Edgesize 5', function() {
    var testInstance = new HexDefinition(5, 1);

    it( '0,0 u, v should be 0.5,0.5 x, y', function() {
      var pixelCoordinates = testInstance.getPixelCoordinates(0, 0);
      expect( pixelCoordinates.x ).toEqual(.5);
      expect( pixelCoordinates.y ).toEqual(.5);
    });
    
    it( '0,0 x, y should be 0,0 u, v', function() {
      var hexCoordinates = testInstance.getReferencePoint(0, 0);
      expect( hexCoordinates.u ).toEqual(0);
      expect( hexCoordinates.v ).toEqual(0);
    });
  });
});

describe( 'HexDefinition:Scaled', function() {
  describe( 'Edgesize 5', function() {
    var testInstance = new HexDefinition(5, .5);

    it( '0,0 u, v should be 0.5,0.5 x, y', function() {
      var pixelCoordinates = testInstance.getPixelCoordinates(0, 0);
      expect( pixelCoordinates.x ).toEqual(.5);
      expect( pixelCoordinates.y ).toEqual(.5);
    });
    
    it( '0,0 x, y should be 0,0 u, v', function() {
      var hexCoordinates = testInstance.getReferencePoint(0, 0);
      expect( hexCoordinates.u ).toEqual(0);
      expect( hexCoordinates.v ).toEqual(0);
    });
  });
});

describe( 'HexDefinition:EdgeWidth', function() {
  describe( 'Edge Wdith 5', function() {
    var testInstance = new HexDefinition(5, .5, 0, 5);

    it( 'Edgewidth should be accessible when provided', function() {
      expect( testInstance.edgeWidth ).toEqual(5);
    });
    
  });
});