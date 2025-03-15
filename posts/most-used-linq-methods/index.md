---
title: 常用的 LINQ 方法总结
create: 2025-03-15T16:38:23+08:00
---

LINQ（Language Integrated Query，语言集成查询）是 C# 开发者必知必会的一项技能，有了它可以极其方便地操作各种集合类型。

LINQ 可以用关键字的方式书写，使得它的用法更接近于 SQL；同时也提供一系列扩展方法，为更多人所常用。本文均使用方法形式。

LINQ 包含在 `System.Linq` 命名空间中，如果你是 .NET 6 以后的版本且启用了 `ImplictUsings`，则该命名空间已经被自动导入了，不需要再手写 `using`。

## 懒执行的 LINQ

所有**返回多个元素**的 LINQ 方法，返回的是一个懒执行的 `IEnumerable<T>`。这个返回的 `IEnumerable<T>` 只会在真正消费到它的时候才会执行计算。例如：

```csharp
var array = new[] { 1, 2, 3, 4 };

// 这时并不会产生任何的运算
var result = array.Select(i => i * 2);

// 使用 .ToList()（或 .ToArray()）收集后，LINQ 操作才会真正被计算，产生一个新的列表。
var list = result.ToList();

// 或者，遍历它时也会触发计算：
foreach (var i in result)
    Console.WriteLine(i);
```

## Select

类似其他语言中的 `map`，`Select` 可以对集合中所有的元素进行统一的处理，返回一个新的集合：

```csharp
var array = new[] { 1, 2, 3, 4 };

// 将每个元素乘以 2
var result = array.Select(i => i * 2);
// 结果为 [ 2, 4, 6, 8 ]
```

## Where

`Where` 用于筛选集合中所有满足条件的元素，类似其他语言中的 `filter`：

```csharp
var array = new[] { -1, 2, -3, 4 };

// 筛选出所有正整数
var result = array.Where(i => i > 0);
// 结果为 [ 2, 4 ]
```

## OrderBy / OrderByDescending

`OrderBy` 用于排序：

```csharp
var array = new[] { -1, 2, -3, 4 };

// 按该类型的默认方式排序
var result = array.OrderBy(i => i);
// 结果为 [ -3, -1, 2, 4 ]
```

对于一个对象集合：

```csharp
var people = new[]
{
    new Person { Age = 12 },  // A
    new Person { Age = 24 },  // B
    new Person { Age = 18 },  // C
    new Person { Age = 11 },  // D
};

// 按每个 Person 对象的 Age 属性排序
var result = people.OrderBy(p => p.Age);
// 结果为 [ D, A, C, B ]
```

`OrderBy` 执行正序排序，如果需要倒序可以使用 `OrderByDescending`，用法一样：

```csharp
var array = new[] { -1, 2, -3, 4 };

// 倒序排序
var result = array.OrderByDescending(i => i);
// 结果为 [ 4, 2, -1, -3 ]
```

## First / FirstOrDefault

`First` 和 `FirstOrDefault` 都用于获取集合中第一个满足条件的元素，区别在于：
如果集合中一个满足条件的元素都没有，`First` 会直接报错，而 `FirstOrDefault` 会返回该类型的默认值，或用户提供的默认值。

对于所有类型的默认值，可以[在这里查看](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/default-values)。

```csharp
var array = new[] { 11, 22, 33, 44 };

// 获取集合中第一个大于 20 的数字
var number = array.First(i => i > 20);
// 结果为 22
```

```csharp
var array = new[] { 11, 22, 33, 44 };

// 获取集合中第一个大于 100 的数字

// 由于没有符合条件的元素，会直接报错！
var number = array.First(i => i > 100);

// 由于没有符合条件的元素，返回 0，即 int 类型的默认值
var number = array.FirstOrDefault(i => i > 100);

// 由于没有符合条件的元素，返回用户提供的默认值 200
var number = array.FirstOrDefault(i => i > 100, 200);
```

## Any / All

- 如果集合中任意一个元素满足条件，`Any` 返回 `true`，否则返回 `false`。
- 如果集合中所有的元素均满足条件，`All` 返回 `true`，否则返回 `false`。

```csharp
var array = new[] { 11, 22, 33, 44 };

array.Any(i => i > 20);  // true

array.All(i => i > 0);  // true
array.All(i => i > 20);  // false
```

## Take

`Take` 用于获取集合中前 n 个元素。

```csharp
var array = new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 获取前 5 个元素
var result = array.Take(5);
```

## 更多

LINQ 还有很多很多的实用方法，本文只涵盖最最常用的一部分。可以阅读[官方文档](https://learn.microsoft.com/zh-cn/dotnet/csharp/linq/)进行进一步的探索。
