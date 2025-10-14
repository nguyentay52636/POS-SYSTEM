using System.Linq.Expressions;

namespace backend.Extensions;

public static class QueryExtensions
{
    public static IQueryable<T> WhereIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, bool>> predicate)
    {
        return condition ? query.Where(predicate) : query;
    }

    public static IQueryable<T> OrderByIf<T>(this IQueryable<T> query, bool condition, Expression<Func<T, object>> keySelector, bool descending = false)
    {
        if (!condition) return query;

        return descending ? query.OrderByDescending(keySelector) : query.OrderBy(keySelector);
    }
}

public static class StringExtensions
{
    public static bool IsNullOrWhiteSpace(this string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }

    public static string ToDefaultIfEmpty(this string? value, string defaultValue = "")
    {
        return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
    }
}

public static class CollectionExtensions
{
    public static bool IsNullOrEmpty<T>(this IEnumerable<T>? collection)
    {
        return collection == null || !collection.Any();
    }

    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> collection) where T : class
    {
        return collection.Where(item => item != null)!;
    }
}
