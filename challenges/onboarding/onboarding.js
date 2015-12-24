while (true) {
  const targets = []
  targets.push({name: readline(), dist: +readline()})
  targets.push({name: readline(), dist: +readline()})

  print(targets.sort((e1, e2) => e1.dist - e2.dist)[0].name)
}