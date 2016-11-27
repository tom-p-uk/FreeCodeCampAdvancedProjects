describe("Simon", function() {
  var simon;

  beforeEach(function() {
    simon = new Simon();
  });


  describe("random number function", function() {
    it("should generate a random integer between 1 and 4", function() {

      expect(simon.getRandom(0, 3)).toBeLessThan(4);
      expect(simon.getRandom(0, 3)).toBeGreaterThan(-1);
    });
  });

  describe("update sequence function function", function() {
    beforeEach(function(){
      simon.updateSequence();
    });
    it("should push a random number to an array", function() {

      expect(simon.sequenceArray.length).toEqual(1);
    });
  });

  describe("compare sequences array", function() {
    it("should return true if 2 given arrays are identical", function() {
      simon.sequenceArray = [1, 2, 1, 4, 3, 2, 4];
      simon.playerSequenceArray = [1, 2, 1, 4, 3, 2, 4];
      expect(simon.compareSequences()).toBe(true);
    });

    it("should return false if 2 given arrays are not identical", function() {
      simon.sequenceArray = [1, 2, 1, 4, 3, 2, 4];
      simon.playerSequenceArray = [1, 2, 1, 4, 3, 2, 1];
      expect(simon.compareSequences()).toBe(false);
    });
  });


});
