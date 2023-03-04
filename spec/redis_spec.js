

describe("Using async/await", function() {
    beforeEach(async function() {
        await soon();
        value = 0;
    });

    it("should support async execution of test preparation and expectations", async function() {
      await soon();
      value++;
      expect(value).toBeGreaterThan(0);
  });
});