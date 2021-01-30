// demo only, replace with proper escaping function
function escape(str) {
  return str.replace("&", "&amp;").replace(">", "&gt;");
}

function mark(haystack, needle) {
  return needle
    ? escape(haystack).replace(
        new RegExp(`(^|\\s)(${escape(needle)})`, "gi"),
        (_, whitespace, match) => `${whitespace}<mark>${match}</mark>`
      )
    : escape(haystack);
}

describe("`mark` viewhelper", () => {
  it("should work without needle and escape", () => {
    expect(mark("foo")).toBe("foo");
    expect(mark("foo bar")).toBe("foo bar");
    expect(mark("dvi > hdmi")).toBe("dvi &gt; hdmi");
    expect(mark("a&b")).toBe("a&amp;b");
  });

  it("should mark needle at word boundaries", () => {
    expect(mark("foo", "foo")).toBe("<mark>foo</mark>");
    expect(mark("foobar", "foo")).toBe("<mark>foo</mark>bar");
    expect(mark("foobarfoo", "foo")).toBe("<mark>foo</mark>barfoo");
    expect(mark("foobar baz", "baz")).toBe("foobar <mark>baz</mark>");
    expect(mark("Lampion Lampen von lambert", "Lam")).toBe(
      "<mark>Lam</mark>pion <mark>Lam</mark>pen von <mark>lam</mark>bert"
    );
    expect(mark("großes Übel", "Übe")).toBe("großes <mark>Übe</mark>l");
  });

  it("should escape matching and non-matching parts", () => {
    expect(mark("foo a&b bar", "a&b")).toBe("foo <mark>a&amp;b</mark> bar");
    expect(mark("dvi > hdmi", "> hdmi")).toBe("dvi <mark>&gt; hdmi</mark>");
    expect(mark("dvi > hdmi", "hdmi")).toBe("dvi &gt; <mark>hdmi</mark>");
  });
});
